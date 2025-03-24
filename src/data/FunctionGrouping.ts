import Grouping from "./Grouping"

export default class FunctionGrouping {
    namespace: string
    type: string
    name: string
    private _accessor: string
    private _alias: string[]
    private _grouping: Grouping
    private _suggested: number | null

    constructor(namespace: string, type: string, name: string, accessor: string, grouping: Grouping, alias: string[], suggested: number | null) {
        this.namespace = namespace
        this.type = type
        this.name = name
        this._accessor = accessor
        this._grouping = grouping
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

    get accessor(): string {
        return this._accessor
    }

    set accessor(accessor: string) {
        this._accessor = accessor
        saveToStorage()
    }

    get grouping(): Grouping {
        return this._grouping
    }

    set grouping(grouping: Grouping) {
        this._grouping = grouping
        saveToStorage()  
    }

    get alias(): string[] {
        return this._alias
    }

    set alias(alias: string[]) {
        this._alias = alias.sort()
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
            name: this.name,
            accessor: this.accessor,
            group: this.grouping.name,
            alias: this.alias,
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
        functionGrouping.alias ?? [],
        functionGrouping.suggested ?? null
    )
})

function saveToStorage() {
    localStorage.setItem("FunctionGrouping", getJSON());
}

export function getJSON() {
    return "[" + FUNCTION_GROUPINGS.map((functionGrouping: FunctionGrouping) => functionGrouping.json()).join(",") + "]";
}