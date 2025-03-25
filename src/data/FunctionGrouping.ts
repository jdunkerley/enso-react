import Grouping from "./Grouping"

export default class FunctionGrouping {
    namespace: string
    type: string
    name: string
    private _accessor: string | null
    private _alias: string[] | null
    private _grouping: Grouping | null
    private _icon: string | null
    private _suggested: number | null
    private _description: string | null
    private _arguments: string | null
    private _returns: string | null
    private _examples: string | null
    private _errors: string | null
    private _remarks: string | null

    constructor(
        namespace: string,
        type: string, 
        name: string, 
        accessor: string | null = null, 
        grouping: Grouping | null = null, 
        icon: string | null = null, 
        alias: string[] | null  = null, 
        suggested: number | null = null, 
        description: string | null = null,
        args: string | null = null,
        returns: string | null = null,
        examples: string | null = null,
        errors: string | null = null,
        remarks: string | null = null) {
        this.namespace = namespace
        this.type = type
        this.name = name
        this._accessor = accessor
        this._grouping = grouping
        this._icon = icon
        this._alias = alias
        this._suggested = suggested
        this._description = description
        this._arguments = args
        this._returns = returns
        this._examples = examples
        this._errors = errors
        this._remarks = remarks
    }

    isPublic(): boolean | null {
        if (this.accessor === "PUBLIC") {
            return true
        }
        if (this.accessor === "PRIVATE") {
            return false
        }
        return null
    }

    get accessor(): string | null {
        return this._accessor
    }

    set accessor(accessor: string | null) {
        this._accessor = accessor
        saveToStorage()
    }

    get grouping(): Grouping | null {
        return this._grouping
    }

    set grouping(grouping: Grouping | null) {
        this._grouping = grouping
        saveToStorage()  
    }

    get icon(): string | null {
        return this._icon
    }

    set icon(icon: string | null) {
        this._icon = icon
        saveToStorage()
    }

    get alias(): string[] | null {
        return this._alias
    }

    set alias(alias: string[] | null) {
        this._alias = alias
        saveToStorage()
    }

    get suggested(): number | null {
        return this._suggested
    }

    set suggested(suggested: number | null) {
        this._suggested = suggested
        saveToStorage()
    }

    get description(): string | null {
        return this._description
    }

    set description(description: string | null) {
        this._description = description
        saveToStorage()
    }

    get arguments(): string | null {
        return this._arguments
    }

    set arguments(args: string | null) {
        this._arguments = args
        saveToStorage()
    }

    get returns(): string | null {
        return this._returns
    }

    set returns(returns: string | null) {
        this._returns = returns
        saveToStorage()
    }

    get examples(): string | null {
        return this._examples
    }

    set examples(examples: string | null) {
        this._examples = examples
        saveToStorage()
    }

    get errors(): string | null {
        return this._errors
    }

    set errors(errors: string | null) {
        this._errors = errors
        saveToStorage()
    }

    get remarks(): string | null {
        return this._remarks
    }

    set remarks(remarks: string | null) {
        this._remarks = remarks
        saveToStorage()
    }

    static get(namespace: string, type: string, name: string): FunctionGrouping | null {
        return FUNCTION_GROUPINGS.find((functionGrouping: FunctionGrouping) => {
            return functionGrouping.namespace === namespace && functionGrouping.type === type && functionGrouping.name === name
        }) || null
    }

    save() {
        FUNCTION_GROUPINGS.push(this);
    }

    json(): string {
        var obj:any = {
            module: this.namespace,
            type: this.type,
            name: this.name
        }

        if (this.accessor !== null) {
            obj.accessor = this.accessor
        }

        if (this.grouping !== null) {
            obj.group = this.grouping.name === "Default" ? "" : this.grouping.name
        }

        if (this.icon !== null) {
            obj.icon = this.icon
        }

        if (this.alias !== null) {
            obj.alias = [...this.alias].sort()
        }

        if (this.suggested !== null) {
            obj.suggested = this.suggested
        }

        if (this.description !== null) {
            obj.description = this.description
        }

        if (this.arguments !== null) {
            obj.arguments = this.arguments
        }

        if (this.returns !== null) {
            obj.returns = this.returns
        }

        if (this.examples !== null) {
            obj.examples = this.examples
        }

        if (this.errors !== null) {
            obj.errors = this.errors
        }

        if (this.examples !== null) {
            obj.examples = this.examples
        }

        if (this.remarks !== null) {
            obj.remarks = this.remarks
        }

        return JSON.stringify(obj);
    }
}

function loadFromStorage() : any {
    const data = localStorage.getItem("FunctionGrouping");
    if (data) {
        return JSON.parse(data);
    }
    return [];
}

let FUNCTION_GROUPINGS: FunctionGrouping[] = loadFromStorage().map((functionGrouping: any) => {
    return new FunctionGrouping(
        functionGrouping.module,
        functionGrouping.type,
        functionGrouping.name,
        functionGrouping.accessor,
        Grouping.get(functionGrouping.group),
        functionGrouping.icon,
        functionGrouping.alias,
        functionGrouping.suggested,
        functionGrouping.description,
        functionGrouping.arguments,
        functionGrouping.returns,
        functionGrouping.examples,
        functionGrouping.errors,
        functionGrouping.remarks
    )
})

function saveToStorage() {
    localStorage.setItem("FunctionGrouping", getJSON());
}

export function getJSON() {
    return "[" + FUNCTION_GROUPINGS.map((functionGrouping: FunctionGrouping) => functionGrouping.json()).join(",") + "]";
}

export function reset() {
    FUNCTION_GROUPINGS = [];
    saveToStorage();
}