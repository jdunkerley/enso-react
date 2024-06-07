export const GROUPING_COLORS = [
    '#F44336',
    '#E91E63',
    '#9C27B0',
    '#673AB7',
    '#3F51B5',
    '#2196F3',
    '#03A9F4',
    '#00BCD4',
    '#009688',
    '#4CAF50',
    '#8BC34A',
    '#CDDC39',
    '#FFC107',
    '#FF9800',
    '#FF5722'
]

export default class Grouping {
    name: string
    color: string
    displayName?: string
    rank: number | null = null

    constructor(name: string, color: string, displayName?: string) {
        this.name = name
        this.color = color
        this.displayName = displayName || name
    }

    getRank(): number {
        if (this.rank === null) {
            this.rank = GROUPINGS.indexOf(this);
        }

        return this.rank === -1 ? GROUPINGS.length : this.rank;
    }
}

export const DEFAULT = new Grouping('Default', '#A997AD', '')

// Ordering is approximately big to small.
// Affect most data at top down to affect least data at bottom.

// Table operations act on one or more table producing a new table - Join, Union, etc.
// Restructuring - remove columns, rename columns, filter rows, select columns, take and drop, etc., tokenise
// Value Operations - replace, parse, cast, etc. (one (or more) value within a row (look ahead/behind) maps to one value)
// Positioning of Input/Output...

var i: number = 0
var math_i: number = 0
var table_i: number = 0
const GROUPINGS: Grouping[] = [
    new Grouping('Input', GROUPING_COLORS[i++ % GROUPING_COLORS.length]),
    new Grouping('Constants', GROUPING_COLORS[i++ % GROUPING_COLORS.length]),
    new Grouping('Metadata', GROUPING_COLORS[i++ % GROUPING_COLORS.length]),
    new Grouping('Calculations', GROUPING_COLORS[table_i = i++ % GROUPING_COLORS.length]), // Calculations
    new Grouping('Statistics', GROUPING_COLORS[table_i]),
    new Grouping('Selections', GROUPING_COLORS[i++ % GROUPING_COLORS.length]),
    new Grouping('Conversions', GROUPING_COLORS[i % GROUPING_COLORS.length]),    
    new Grouping('Values', GROUPING_COLORS[i++ % GROUPING_COLORS.length]), //Values
    new Grouping('Math', GROUPING_COLORS[math_i = (i++ % GROUPING_COLORS.length)]),
    new Grouping('Rounding', GROUPING_COLORS[math_i]),
    new Grouping('Trigonmetry', GROUPING_COLORS[math_i]),
    new Grouping('Random', GROUPING_COLORS[math_i]),
    new Grouping('Bitwise', GROUPING_COLORS[math_i]),
    new Grouping('Text', GROUPING_COLORS[i++ % GROUPING_COLORS.length]),
    new Grouping('DateTime', GROUPING_COLORS[i++ % GROUPING_COLORS.length]),
    new Grouping('Logical', GROUPING_COLORS[i++ % GROUPING_COLORS.length]),
    new Grouping('Output', GROUPING_COLORS[i++ % GROUPING_COLORS.length]),
    new Grouping('Operators', GROUPING_COLORS[i++ % GROUPING_COLORS.length]),
    new Grouping('Errors', GROUPING_COLORS[i++ % GROUPING_COLORS.length])
]

export function getGrouping(name: string): Grouping {
    return GROUPINGS.find((grouping: Grouping) => grouping.name === name) || DEFAULT
}
