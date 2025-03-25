import FunctionGrouping from "./FunctionGrouping"
import Grouping, { ALL_GROUP, SUGGESTED, DEFAULT } from "./Grouping"
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
    return initials.join("").toLowerCase()
}

export enum MatchTypeScore {
    NameStartsWith = 0,
    TypeStartsWith = 500,
    AliasStartsWith = 1000,
    NameWordMatch = 2000,
    AliasWordMatch = 3000,
    NameInitialMatch = 4000,
    AliasInitialMatch = 5000
}

export default class Function {
    private readonly _isPublic: boolean
    readonly namespace: string
    readonly type: string
    readonly name: string
    readonly initials: string
    readonly key: string
    readonly functionType: FunctionType
    readonly functionArguments: FunctionArgument[]
    readonly returnType: string
    private readonly _aliases: string[]
    private aliasInitials: string[]
    private readonly _suggested: number | null
    private readonly _grouping: Grouping | null = null
    private readonly _icon: string | null = null
    private readonly typePrefix: string
    private readonly typeInitials: string
    private readonly _description: string | null
    private readonly _args: string | null
    private readonly _returns: string | null
    private readonly _examples: string | null
    private readonly _errors: string | null
    private readonly _remarks: string | null

    constructor(
        isPublic: boolean,
        namespace: string,
        type: string,
        name: string,
        functionType: FunctionType,
        functionArguments: FunctionArgument[],
        returnType: string,
        aliases: string[],
        grouping: string | null,
        icon: string | null,
        suggested: number | null = null,
        description: string | null = null,
        args: string | null = null,
        returns: string | null = null,
        examples: string | null = null,
        errors: string | null = null,
        remarks: string | null = null) {
        this._isPublic = isPublic

        this.namespace = namespace
        this.type = type
        this.name = name
        this.initials = getInitials(name)
        this.key = `${this.namespace}.${this.type}.${this.name}`

        this.functionType = functionType
        this.functionArguments = functionArguments
        this.returnType = returnType

        this._aliases = aliases
        this.aliasInitials = aliases.map(getInitials)

        this._grouping = grouping == null ? null : Grouping.get(grouping)
        this._icon = icon

        this._suggested = suggested

        this._description = description
        this._args = args
        this._returns = returns
        this._examples = examples
        this._errors = errors
        this._remarks = remarks

        this.typePrefix = this.functionType === FunctionType.Instance || this.functionType === FunctionType.Extension 
            ? ''
            : (this.type || this.namespace.split(".").pop())+'.'
        this.typeInitials = getInitials(this.typePrefix).toLowerCase()
    }

    getDisplayText(search: string) {
        const match = this.getSearch(search)?.[1]
        return this.typePrefix + this.name + (match && match !== this.name ? ` (${match})` : "")
    }

    private functionGrouping(createIfNull:boolean=false) : FunctionGrouping | null {
        let current = FunctionGrouping.get(this.namespace, this.type, this.name)
        if (!current && createIfNull) {
            current = new FunctionGrouping(this.namespace, this.type, this.name)
            current.save()
        }
        return current
    }

    get isPublic(): boolean {
        return this.functionGrouping()?.isPublic() ?? this._isPublic
    }

    set isPublic(isPublic: boolean) {
        const grouping = this.functionGrouping(true)
        if (grouping === null) {
            throw new Error("FunctionGrouping not found")
        }
        grouping.accessor = isPublic === this._isPublic ? null : (isPublic ? "PUBLIC" : "PRIVATE")
    }

    get grouping(): Grouping {
        return this.functionGrouping()?.grouping ?? this._grouping ?? DEFAULT
    }

    set grouping(grouping: Grouping) {
        const functionGrouping = this.functionGrouping(true)
        if (functionGrouping === null) {
            throw new Error("FunctionGrouping not found")
        }
        functionGrouping.grouping = grouping.name === this._grouping?.name ? null : grouping
    }

    get icon(): string | null {
        return this.functionGrouping()?.icon ?? this._icon
    }

    set icon(icon: string | null) {
        const grouping = this.functionGrouping(true)
        if (grouping === null) {
            throw new Error("FunctionGrouping not found")
        }
        grouping.icon = icon === this._icon ? null : icon
    }

    get aliases(): string[] {
        return this.functionGrouping()?.alias ?? this._aliases
    }

    set aliases(alias: string[]) {
        const grouping = this.functionGrouping(true)
        if (grouping === null) {
            throw new Error("FunctionGrouping not found")
        }

        const sorted = alias.filter(t => t !== "").sort()
        const matches = this.aliases.length === alias.length && this.aliases.every((v, i) => v === sorted[i])
        grouping.alias = matches ? null : alias

        this.aliasInitials = alias.map(getInitials)
    }

    get suggested(): number | null {
        return this.functionGrouping()?.suggested ?? this._suggested
    }

    set suggested(suggested: number | null) {
        const grouping = this.functionGrouping(true)
        if (grouping === null) {
            throw new Error("FunctionGrouping not found")
        }
        grouping.suggested = suggested
    }

    get description(): string | null {
        return this.functionGrouping()?.description ?? this._description
    }

    set description(description: string | null) {
        const grouping = this.functionGrouping(true)
        if (grouping === null) {
            throw new Error("FunctionGrouping not found")
        }
        grouping.description = description === this._description ? null : description
    }

    get arguments(): string | null {
        return this.functionGrouping()?.arguments ?? this._args
    }

    set arguments(args: string | null) {
        const grouping = this.functionGrouping(true)
        if (grouping === null) {
            throw new Error("FunctionGrouping not found")
        }
        grouping.arguments = args === this._args ? null : args
    }

    get returns(): string | null {
        return this.functionGrouping()?.returns ?? this._returns
    }

    set returns(returns: string | null) {
        const grouping = this.functionGrouping(true)
        if (grouping === null) {
            throw new Error("FunctionGrouping not found")
        }
        grouping.returns = returns === this._returns ? null : returns
    }

    get examples(): string | null {
        return this.functionGrouping()?.examples ?? this._examples
    }

    set examples(examples: string | null) {
        const grouping = this.functionGrouping(true)
        if (grouping === null) {
            throw new Error("FunctionGrouping not found")
        }
        grouping.examples = examples === this._examples ? null : examples
    }

    get errors(): string | null {
        return this.functionGrouping()?.errors ?? this._errors
    }

    set errors(errors: string | null) {
        const grouping = this.functionGrouping(true)
        if (grouping === null) {
            throw new Error("FunctionGrouping not found")
        }
        grouping.errors = errors === this._errors ? null : errors
    }

    get remarks(): string | null {
        return this.functionGrouping()?.remarks ?? this._remarks
    }

    set remarks(remarks: string | null) {
        const grouping = this.functionGrouping(true)
        if (grouping === null) {
            throw new Error("FunctionGrouping not found")
        }
        grouping.remarks = remarks === this._remarks ? null : remarks
    }

    private scoreMatch(matchType: MatchTypeScore, match: string, search: string) : number {
        var matchScore = match === search ? 0 : 50
        if (search !== "") {
            const pattern = new RegExp("(?:^|_)(" + search.replaceAll("_", "[^_]*).*?_(") + "[^_]*).*")
            const matched = pattern.exec(match) ?? [""]
            matched.shift()
            const match_text = matched.join("_")
            matchScore += Math.floor((match_text.length - search.length) * 50 / match_text.length)
        }
        
        return (matchType + matchScore) * 100 + this.grouping.getRank()
    }

    getSearch(search:string,  matchType:boolean=true): [number, string] | null {
        // Special Handling for `.` characters
        if (search.includes(".")) {
            if (this.functionType !== FunctionType.Static) return null
            const idx = search.indexOf(".")
            const type = search.substring(0, idx)
            return this.typePrefix.toLowerCase().startsWith(type) || this.typeInitials.startsWith(type) ? this.getSearch(search.substring(idx+1), false) : null
        }

        // Special Handling for `_` characters, compile to regex
        function makeRegexMatcher(search: string) {
            const toMatch = new RegExp("(^|_)" + search.replaceAll("_", ".*_"), "i")
            return (text:string) => toMatch.exec(text)?.index
        }

        function makeTextMatcher(search: string) {
            return (text:string) => {
                if (text.startsWith(search)) {
                    return 0
                }

                const index = text.indexOf("_" + search)
                return index === -1 ? undefined : index
            }
        }

        const matcher : (text:string) => (number | undefined) = search.includes("_") 
            ? makeRegexMatcher(search)
            : makeTextMatcher(search)

        // Starts With match
        const nameMatch = matcher(this.name)
        if (nameMatch === 0) {
            return [this.scoreMatch(MatchTypeScore.NameStartsWith, this.name, search), this.name]
        }

        // Static Type Starts With match
        if (matchType && this.functionType === FunctionType.Static && this.typePrefix.toLowerCase().startsWith(search)) {
            return [this.scoreMatch(MatchTypeScore.TypeStartsWith, this.typePrefix, search), this.name]
        } 

        // Alias Starts With match
        const alias = this.aliases.find((alias: string) => matcher(alias) === 0)
        if (alias) {
            return [this.scoreMatch(MatchTypeScore.AliasStartsWith, alias, search), alias]
        } 

        // Name Word match
        if (nameMatch) {
            return [this.scoreMatch(MatchTypeScore.NameWordMatch, this.name, search), this.name]
        }
        const aliasWord = this.aliases.find((alias: string) => matcher(alias))
        if (aliasWord) {
            return [this.scoreMatch(MatchTypeScore.AliasWordMatch, aliasWord, search), aliasWord]
        } 

        // Initial match (no regexp here)
        var trimmed = matchType && search.startsWith(this.typeInitials) ? search.substring(this.typeInitials.length) : search
        if (this.initials.startsWith(search) || this.initials.startsWith(trimmed)) {
            return [this.scoreMatch(MatchTypeScore.NameInitialMatch, this.initials, search), this.name]
        }
        const aliasInitials = this.aliasInitials.find((alias: string) => alias.startsWith(search) || alias.startsWith(trimmed))
        if (aliasInitials) {
            const index = this.aliasInitials.indexOf(aliasInitials)
            return [this.scoreMatch(MatchTypeScore.AliasInitialMatch, aliasInitials, search), this.aliases[index]]
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
        fn.aliases,
        fn.group,
        fn.icon,
        fn.suggested,
        fn.description,
        fn.arguments,
        fn.returns,
        fn.examples,
        fn.errors,
        fn.remarks);
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

export function getTypes() {
    const filteredFunctions = FUNCTIONS.filter(fn => fn.name !== 'from' && fn.functionType !== FunctionType.Extension)
        .map(fn => fn.namespace + "." + fn.type)
        .filter(fqn => fqn !== 'Standard.Base.Meta.Error' && fqn !== 'Standard.Base.Meta.Polyglot' && !fqn.includes("Extensions.") && fqn !== 'Standard.Database.Internal.IR.Context.Context' && fqn !== 'Standard.Table.Excel.Excel_Workbook.Return_As');
    return [null, ...new Set(filteredFunctions)];
}

export function getFunctions(search: string, targetNamespace: string | null, targetType: string | null, grouping : string, includePrivate: boolean, revision: number): Function[] {
    var cache : { [id:string] : number | null } = {}
    const getRankNumber = (fn:Function): number | null => {
        if (grouping === SUGGESTED && (search ?? "").trim() === "") {
            return fn.suggested
        }
        if (cache[fn.key] === undefined) {
            cache[fn.key] = fn.getSearch(search)?.[0] ?? null
        }

        return cache[fn.key]
    }

    const raw = FUNCTIONS.filter((fn: Function) => {
        if (!includePrivate && !fn.isPublic) return false

        if (grouping === SUGGESTED) {
            if (fn.suggested === null) {
                return false
            }
        } else if (grouping !== ALL_GROUP && fn.grouping.name !== grouping) {
            return false
        }

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

        return getRankNumber(fn) !== null
    }).sort((a: Function, b: Function) => {
        // In the order:
        // - If the function name starts with the search
        // - If an alias starts with the search
        // - If a word starts with the search
        // - If a word of the alias starts with the search
        // - If the initials of the function name starts with the search
        // - If the initials of the alias starts with the search
        // Number of unmatched characters in the matching name (if all matched better than if only some matched)
        // Group Pecking Order
        // Function pecking order  (Advanced / Normal, value types)

        const aRank = (getRankNumber(a) ?? 1000000)
        const bRank = (getRankNumber(b) ?? 1000000)
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
