import FunctionGrouping from "./FunctionGrouping"
import Grouping from "./Grouping"
import functions from "./types_functions.json"

export class FunctionArgument {
    name: string
    type: string

    constructor(name: string, type: string) {
        this.name = name
        this.type = type
    }
}

export enum FunctionType {
    Constructor = "ctor",
    Static = "static",
    Instance = "method",
    Extension = "extension"
}

const getInitials = (name: string): string => {
    const words = name.replaceAll("_", " ").split(" ")
    const initials = words.map((word: string) => word.charAt(0))
    return initials.join("")
}

export default class Function {
    isPublic: boolean
    namespace: string
    type: string
    name: string
    initials: string
    key: string
    functionType: FunctionType
    functionArguments: FunctionArgument[]
    returnType: string
    aliases: string[]
    aliasInitials: string[]
    private grouping: Grouping | null = null
    private typePrefix: string

    constructor(isPublic: boolean, namespace: string, type: string, name: string, functionType: FunctionType, functionArguments: FunctionArgument[], returnType: string, aliases: string[]) {
        this.isPublic = isPublic

        this.namespace = namespace
        this.type = type
        this.name = name
        this.initials = getInitials(name)
        this.key = `${this.namespace}.${this.type}.${this.name}`

        this.functionType = functionType
        this.functionArguments = functionArguments
        this.returnType = returnType

        this.aliases = aliases
        this.aliasInitials = aliases.map(getInitials)

        this.typePrefix = this.functionType === FunctionType.Instance || this.functionType === FunctionType.Extension 
            ? ''
            : (this.type || this.namespace.split(".").pop())+' '
    }

    getDisplayText(search: string) {
        const match = this.getSearch(search)?.[1]

        return this.typePrefix + this.name + (match && match !== this.name ? ` (${match})` : "")
    }

    getGrouping(): Grouping {
        if (!this.grouping) {
            const functionGrouping = FunctionGrouping.getGrouping(this.namespace, this.type, this.name)
            this.grouping = functionGrouping.grouping
        }

        return this.grouping
    }

    getSearch(search:string): [number, string] | null {
        const groupingRank = this.getGrouping().getRank()

        function scoreMatch(match: string, search: string) : number {
            const regex = new RegExp(`(^|^.*?_)(${search}[^_]*)($|_.*$)`, "i")
            const matchWord = match.replace(regex, "$2")
            return Math.floor((matchWord.length - search.length) * 100 / matchWord.length)
        }

        // Static should check type
        if (this.functionType === FunctionType.Static && this.typePrefix.toLowerCase().startsWith(search)) return [groupingRank + scoreMatch(this.typePrefix, search), this.name]

        // Starts With match
        if (this.name.startsWith(search)) return [groupingRank + scoreMatch(this.name, search), this.name]
        const alias = this.aliases.find((alias: string) => alias.startsWith(search))
        if (alias) return [groupingRank + 1000 + scoreMatch(alias, search), alias]

        // Word match
        if (this.name.includes("_" + search)) return [groupingRank + 2000 + scoreMatch(this.name, search), this.name]
        const aliasWord = this.aliases.find((alias: string) => alias.includes("_" + search))
        if (aliasWord) return [groupingRank + 1000 + scoreMatch(aliasWord, search), aliasWord]

        // Initial match
        if (this.initials.startsWith(search)) return [groupingRank + 4000 + scoreMatch(this.initials, search), this.name]
        const aliasInitials = this.aliasInitials.find((alias: string) => alias.startsWith(search))
        if (aliasInitials) {
            const index = this.aliasInitials.indexOf(aliasInitials)
            return [groupingRank + 5000 + scoreMatch(aliasInitials, search), this.aliases[index]]
        } 
    
        return null
    }
}

export const FUNCTIONS: Function[] = functions.map((fn: any) => {
    const isPublic = fn.accessor === "PUBLIC"
    const fnArguments = fn.arguments
    return new Function(
        isPublic,
        fn.module.replace(/\.Main$/, ""),
        fn.type,
        fn.name,
        fn.methodType,
        fnArguments,
        fn.returnType,
        fn.aliases);
}).filter((fn: Function) => !fn.namespace.startsWith("Standard.Test") && !fn.namespace.startsWith("Standard.Examples"))

function makeUnique(array: Function[], search: string) : Function[] {
    const seen = new Set()
    return array.filter((fn: Function) => {
        const key = fn.getDisplayText(search)
        if (seen.has(key)) return false
        seen.add(key)
        return true
    })
}

export function getFunctions(search: string, targetNamespace: string | null, targetType: string | null): Function[] {
    var cache : { [id:string] : number | null } = {}
    const getRankNumber = (fn:Function): number | null => {
        if (cache[fn.key] === undefined) {
            cache[fn.key] = fn.getSearch(search)?.[0] || null
        }

        return cache[fn.key]
    }

    const raw = FUNCTIONS.filter((fn: Function) => {
        if (!fn.isPublic) return false

        if (fn.functionType === FunctionType.Constructor) {
            return false
        } else if (fn.functionType === FunctionType.Extension) {
            if (fn.type !== targetType) return false
        } else if (fn.functionType === FunctionType.Instance) {
            var isBaseMethod = targetType && fn.type === 'Any'
            if (!isBaseMethod && fn.type === 'Number' && targetType && ['Integer', 'Decimal'].includes(targetType)) isBaseMethod = true
            if (!isBaseMethod && (fn.namespace !== targetNamespace || fn.type !== targetType)) return false
        } else if (fn.functionType === FunctionType.Static) {
            if (targetNamespace || targetType) return false
        }

        if (search.includes(".")) {
            if (fn.functionType !== FunctionType.Static) return false

        }

        return getRankNumber(fn) !== null
    }).sort((a: Function, b: Function) => {
        // In the order:
        // If the function name starts with the search
        // If an alias starts with the search
        // If a word starts with the search
        // If a word of the alias starts with the search
        // If the initials of the function name starts with the search
        // If the initials of the alias starts with the search

        // Number of unmatched characters in the matching name (if all matched better than if only some matched)

        // Group Pecking Order

        // Funciton pecking order  (Advanced / Normal, value types)

        const aRank = (getRankNumber(a) || 1000000)
        const bRank = (getRankNumber(b) || 1000000)
        if (aRank !== bRank) return aRank - bRank

        if (a.functionType === FunctionType.Static && b.functionType === FunctionType.Static)
        {
            const aNamespace = a.namespace.split(".")[1].replace(/^Base$/, "")
            const bNamespace = b.namespace.split(".")[1].replace(/^Base$/, "")
            if (aNamespace !== bNamespace) return aNamespace < bNamespace ? -1 : 1
        }

        const aDisplay = a.getDisplayText(search)
        const bDisplay = b.getDisplayText(search)
        return aDisplay === bDisplay ? 0 : (aDisplay < bDisplay ? -1 : 1)
    })

    return makeUnique(raw, search)
}
