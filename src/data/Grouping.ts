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

const GROUPINGS: Grouping[] = [
    new Grouping('Input', '#ff0000'),
    new Grouping('File', '#006d4f'), // oklch(0.464 0.14 170)
    new Grouping('Database', '#3e6700'), // oklch(0.464 0.14 130)
    new Grouping('Web', '#005ca2'), // oklch(0.464 0.14 245)
    new Grouping('System', '#3c50a6'), // oklch(0.464 0.14 270)
    new Grouping('Constants', '#0c6c1e'), // oklch(0.464 0.14 145)
    new Grouping('Metadata', '#516200'), // oklch(0.464 0.14 120)
    new Grouping('Output', '#ff0000'),
    new Grouping('Calculations', '#00638d'), // oklch(0.464 0.14 230)
    new Grouping('Statistics', '#00638d'), // oklch(0.464 0.14 230)
    new Grouping('Selections', '#7e3783'), // oklch(0.464 0.14 325)
    new Grouping('Conversions', '#963509'), // color: oklch(0.464 0.14 40)
    new Grouping('Values', '#454ea6'), // oklch(0.464 0.14 275)
    new Grouping('Math', '#66429a'), // oklch(0.464 0.14 300)
    new Grouping('Rounding', '#66429a'), // oklch(0.464 0.14 300)
    new Grouping('Trigonmetry', '#66429a'), // oklch(0.464 0.14 300)
    new Grouping('Random', '#66429a'), // oklch(0.464 0.14 300)
    new Grouping('Bitwise', '#66429a'), // oklch(0.464 0.14 300)
    new Grouping('Text', '#5a46a1'), // oklch(0.464 0.14 290)
    new Grouping('DateTime', '#61449e'), // oklch(0.464 0.14 295)
    new Grouping('Logical', '#66429a'), // oklch(0.464 0.14 300)
    new Grouping('Operators', '#454ea6'), // oklch(0.464 0.14 275)
    new Grouping('Errors', '#972e3f'), // oklch(0.464 0.14 15)
]

export const ALL_GROUP = 'All'
export const SUGGESTED = 'Suggested'
export const GROUPING_NAMES = [ALL_GROUP, SUGGESTED, ...GROUPINGS.map((grouping: Grouping) => grouping.name)]

export function getGrouping(name: string): Grouping {
    return GROUPINGS.find((grouping: Grouping) => grouping.name === name) || DEFAULT
}
