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

    constructor(namespace: string, type: string, name: string, accessor: string | null = null, grouping: Grouping | null = null, icon: string | null = null, alias: string[] | null  = null, suggested: number | null = null) {
        this.namespace = namespace
        this.type = type
        this.name = name
        this._accessor = accessor
        this._grouping = grouping
        this._icon = icon
        this._alias = alias
        this._suggested = suggested
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
            obj.alias = this.alias.sort()
        }

        if (this.suggested !== null) {
            obj.suggested = this.suggested
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

const FUNCTION_GROUPINGS: FunctionGrouping[] = loadFromStorage().map((functionGrouping: any) => {
    return new FunctionGrouping(
        functionGrouping.module,
        functionGrouping.type,
        functionGrouping.name,
        functionGrouping.accessor,
        Grouping.get(functionGrouping.group),
        functionGrouping.icon,
        functionGrouping.alias,
        functionGrouping.suggested
    )
})

function saveToStorage() {
    localStorage.setItem("FunctionGrouping", getJSON());
}

export function getJSON() {
    return "[" + FUNCTION_GROUPINGS.map((functionGrouping: FunctionGrouping) => functionGrouping.json()).join(",") + "]";
}