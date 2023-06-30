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

var i: number = 0
var math_i: number = 0
const GROUPINGS: Grouping[] = [
    new Grouping('Input / Output', GROUPING_COLORS[i++ % GROUPING_COLORS.length]),
    new Grouping('Constants', GROUPING_COLORS[i++ % GROUPING_COLORS.length]),
    new Grouping('Metadata', GROUPING_COLORS[i++ % GROUPING_COLORS.length]),
    new Grouping('Table Operations', GROUPING_COLORS[i++ % GROUPING_COLORS.length]),
    new Grouping('Statistics', GROUPING_COLORS[i++ % GROUPING_COLORS.length]),
    new Grouping('Find / Lookup', GROUPING_COLORS[i++ % GROUPING_COLORS.length]),
    new Grouping('Column Operations', GROUPING_COLORS[i++ % GROUPING_COLORS.length]),
    new Grouping('Row Operations', GROUPING_COLORS[i++ % GROUPING_COLORS.length]),
    new Grouping('Conversion / Parsing', GROUPING_COLORS[i++ % GROUPING_COLORS.length]),
    new Grouping('Math', GROUPING_COLORS[math_i = (i++ % GROUPING_COLORS.length)]),
    new Grouping('Math : Rounding', GROUPING_COLORS[math_i]),
    new Grouping('Math : Trigonmetry', GROUPING_COLORS[math_i]),
    new Grouping('Math : Bitwise', GROUPING_COLORS[math_i]),
    new Grouping('Text', GROUPING_COLORS[i++ % GROUPING_COLORS.length]),
    new Grouping('Date / Time', GROUPING_COLORS[i++ % GROUPING_COLORS.length]),
    new Grouping('Logical', GROUPING_COLORS[i++ % GROUPING_COLORS.length]),
    new Grouping('Process / File', GROUPING_COLORS[i++ % GROUPING_COLORS.length]),
    new Grouping('Operators', GROUPING_COLORS[i++ % GROUPING_COLORS.length]),
    new Grouping('Cloud / Web', GROUPING_COLORS[i++ % GROUPING_COLORS.length]),
    new Grouping('Data Generation', GROUPING_COLORS[i++ % GROUPING_COLORS.length]),
    new Grouping('Error Handling', GROUPING_COLORS[i++ % GROUPING_COLORS.length])
]

export function getGrouping(name: string): Grouping {
    return GROUPINGS.find((grouping: Grouping) => grouping.name === name) || DEFAULT
}
