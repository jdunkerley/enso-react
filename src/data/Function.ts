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

export default class Function {
    isPublic: boolean
    namespace: string
    type: string
    name: string
    functionType: FunctionType
    functionArguments: FunctionArgument[]
    returnType: string
    aliases: string[]
    private grouping: Grouping | null = null

    constructor(isPublic: boolean, namespace: string, type: string, name: string, functionType: FunctionType, functionArguments: FunctionArgument[], returnType: string, aliases: string[]) {
        this.isPublic = isPublic
        this.namespace = namespace
        this.type = type
        this.name = name
        this.functionType = functionType
        this.functionArguments = functionArguments
        this.returnType = returnType
        this.aliases = aliases
    }

    getGrouping(): Grouping {
        if (!this.grouping) {
            this.grouping = FunctionGrouping.getGrouping(this.namespace, this.type, this.name).grouping
        }

        return this.grouping
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

const getInitials = (name: string): string => {
    const words = name.replaceAll("_", " ").split(" ")
    const initials = words.map((word: string) => word.charAt(0))
    return initials.join("")
}

export function getFunctions(search: string, targetNamespace: string | null, targetType: string | null): Function[] {
    return FUNCTIONS.filter((fn: Function) => {
        if (!fn.isPublic) return false

        if (fn.functionType === FunctionType.Constructor) {
            return false
        } else if (fn.functionType === FunctionType.Extension) {
            if (fn.type !== targetType) return false
        } else if (fn.functionType === FunctionType.Instance) {
            if (fn.namespace !== targetNamespace || fn.type !== targetType) return false
        } else if (fn.functionType === FunctionType.Static) {
            if (!targetNamespace || !targetType) return false
        }

        if (fn.name.startsWith(search)) return true
        if (fn.aliases.some((alias: string) => alias.startsWith(search))) return true

        // Word Starts With
        if (getInitials(fn.name).startsWith(search)) return true
        if (fn.aliases.some((alias: string) => getInitials(alias).startsWith(search))) return true

        return false
    })
}
