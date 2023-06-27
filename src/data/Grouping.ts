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

var i: number = 0
export const INPUT_OUTPUT = new Grouping('Input / Output', GROUPING_COLORS[i++ % GROUPING_COLORS.length])
export const USER_INPUT = new Grouping('Constants', GROUPING_COLORS[i++ % GROUPING_COLORS.length])
export const PREPARATION = new Grouping('Preparation', GROUPING_COLORS[i++ % GROUPING_COLORS.length])
export const JOIN_TRANSFORM = new Grouping('Join / Transform', GROUPING_COLORS[i++ % GROUPING_COLORS.length])
export const FIND_LOOKUP = new Grouping('Find / Lookup', GROUPING_COLORS[i++ % GROUPING_COLORS.length])
export const DESCRIPTIVE = new Grouping('Descriptive', GROUPING_COLORS[i++ % GROUPING_COLORS.length])
export const MATH = new Grouping('Math', GROUPING_COLORS[i++ % GROUPING_COLORS.length])
export const TEXT = new Grouping('Text', GROUPING_COLORS[i++ % GROUPING_COLORS.length])
export const DATE_TIME = new Grouping('Date / Time', GROUPING_COLORS[i++ % GROUPING_COLORS.length])
export const LOGICAL = new Grouping('Logical', GROUPING_COLORS[i++ % GROUPING_COLORS.length])
export const OPERATORS = new Grouping('Operators', GROUPING_COLORS[i++ % GROUPING_COLORS.length])
export const PROCESS_FILE = new Grouping('Process / File', GROUPING_COLORS[i++ % GROUPING_COLORS.length])
export const CLOUD_WEB = new Grouping('Cloud / Web', GROUPING_COLORS[i++ % GROUPING_COLORS.length])
export const DATA_GENERATION = new Grouping('Data Generation', GROUPING_COLORS[i++ % GROUPING_COLORS.length])
export const ERROR_HANDLING = new Grouping('Error Handling', GROUPING_COLORS[i++ % GROUPING_COLORS.length])

const GROUPINGS: Grouping[] = [
    INPUT_OUTPUT,
    USER_INPUT,
    PREPARATION,
    JOIN_TRANSFORM,
    FIND_LOOKUP,
    DESCRIPTIVE,
    MATH,
    TEXT,
    DATE_TIME,
    LOGICAL,
    OPERATORS,
    PROCESS_FILE,
    CLOUD_WEB,
    DATA_GENERATION,
    ERROR_HANDLING]

export function getGrouping(name: string): Grouping {
    return GROUPINGS.find((grouping: Grouping) => grouping.name === name) || DEFAULT
}
