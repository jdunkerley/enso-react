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
    }

    getDisplayText(search: string) {
        if (search === "") return this.name
        return this.aliases.find((alias: string) => alias.startsWith(search) || getInitials(alias).startsWith(search)) || this.name
    }

    getGrouping(): Grouping {
        if (!this.grouping) {
            const functionGrouping = FunctionGrouping.getGrouping(this.namespace, this.type, this.name)
            this.grouping = functionGrouping.grouping
        }

        return this.grouping
    }

    getRankNumber(search:string): number | null {
        const groupingRank = this.getGrouping().getRank()

        function scoreMatch(match: string, search: string) : number {
            return (match.length - search.length) * 100 / match.length
        }

        // Starts With match
        if (this.name.startsWith(search)) return groupingRank + scoreMatch(this.name, search)
        const alias = this.aliases.find((alias: string) => alias.startsWith(search))
        if (alias) return groupingRank + 1000 + scoreMatch(alias, search)

        // Word match
        if (this.name.includes("_" + search)) return groupingRank + 2000 + scoreMatch(this.name, search)
        const aliasWord = this.aliases.find((alias: string) => alias.includes("_" + search))
        if (aliasWord) return groupingRank + 1000 + scoreMatch(aliasWord, search)

        // Initial match
        if (this.initials.startsWith(search)) return groupingRank + 4000 + scoreMatch(this.initials, search)
        var aliasInitials = this.aliasInitials.find((alias: string) => alias.startsWith(search))
        if (aliasInitials) return groupingRank + 5000 + scoreMatch(aliasInitials, search)
    
        return null
    }
}

export const FUNCTIONS: Function[] = functions.map((fn: any) => {
    const isPublic = fn.accessor === "PUBLIC"
    const fnArguments = fn.arguments
    return new Function(
        isPublic,
        fn.module,
        fn.type,
        fn.name,
        fn.methodType,
        fnArguments,
        fn.returnType,
        fn.aliases);
})

export function getFunctions(search: string, targetNamespace: string | null, targetType: string | null): Function[] {
    var cache : { [id:string] : number | null } = {}
    const getRankNumber = (fn:Function): number | null => {
        if (cache[fn.key] === undefined) {
            cache[fn.key] = fn.getRankNumber(search)
        }

        return cache[fn.key]
    }

    return FUNCTIONS.filter((fn: Function) => {
        if (!fn.isPublic) return false

        if (fn.functionType === FunctionType.Constructor) {
            return false
        } else if (fn.functionType === FunctionType.Extension) {
            if (fn.type !== targetType) return false
        } else if (fn.functionType === FunctionType.Instance) {
            if (fn.namespace !== targetNamespace || fn.type !== targetType) return false
        } else if (fn.functionType === FunctionType.Static) {
            if (targetNamespace || targetType) return false
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
        return aRank - bRank
    })
}
