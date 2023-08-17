# CB Search

- Case-insensitive search
- Search either for "word starts with" or "initials starts with". **Does not match contains within words.**
- If not connected to anything, search within static functions and constructors.
- If incoming, then just search within instance methods or extension methods of the type (or parent types).
- Does not include PRIVATE, optionally includes ADVANCED/UNSTABLE.
- Match within either names or aliases. For static methods or constructors, prefix with either the type name or module name if not in a type.
- If search string contains a `.`, then the first part is used to search within the type (or module name). Only relevant for static methods or constructors.
- If the search string contains a `_`, then each part represents a starts with word and must be matched in the same order they occur.

## Examples within Table:

- `col` will match `columns`, `column_count`, `select_columns`.
- `col_` will match `columns`, `column_count`, but not `select_columns` (because no following word after `col`).
- `col_c` will match `column_count`, but not `columns` or `select_columns` (because `col` must be followed by another word starting with `c`).
- `sc` will match `select_columns`, but not `columns` or `column_count` (because `sc` must be at the beginning of a word or initials of word).
- `drop` will match `drop`, `drop_duplicates`, `dropna`.

## Examples within Static:

- `read` will match `Data.read`, `Image.read`, `Data.read_text`, `Environment.get`.
- `rt` will match `Data.read_text`.
- `drt` will match `Data.read_text`.
- `dp` will match `Date.parse`, `Decimal.parse`.
- `dtp` will match `Date_Time.parse`.
- `d.` will match all methods within types starting with `d` (e.g. `Data`, `Date`, `Date_Time`).
- `dt.` will match all methods within types starting with `dt` or with initials `dt` (e.g. `Date_Time`).

## Scoring

For ordering the search the scoring used:

- First based on type of match:
  - Name starts with
  - Type starts with
  - Alias starts with
  - Name words match but not first word
  - Alias words match but not first word
  - Name initials
  - Alias initials
- Then based on percentage of the word matched (i.e. if looking for `col` the word `column` scores higher than `columns`)
- Then based on the group ranking
- Final alphabetically on (`Module` or `Type` name and `Method` name)

## Grouping

- `Input`: Read data into Enso.
- `Constants`: Create a constant value (e.g. new table, new vector, new map).
- `Metadata`: A property of the object (e.g. length, row_count).
- `Output`: Output data from Enso somewhere else.
- `Calculations`: Operations acting on the whole object producing a new object (e.g. join, aggregation).
- `Statistics`: Statistical computation on the whole object (e.g. mean, median).
- `Selections`: Selecting a subset of the object (e.g. filter, slice, picking columns or rows).
- `Conversions`: Convert single values to another type (e.g. to string, to integer).
- `Values`: Miscellaneous single value operations (e.g. fill nulls, index of).
- `Math`: Mathematical operations on single value (e.g. square root, power).
- `Rounding`: Rounding single value (e.g. round, floor).
- `Trigonometry`: Trigonometric operations on single value (e.g. sin, cos).
- `Random`: Random number generation.
- `Bitwise`: Bitwise operations on single value (e.g. and, or).
- `Text`: Text operations on single value (e.g. replace, to case).
- `DateTime`: Date and time operations on single value (e.g. date part, add period).
- `Logical`: True or false operations on single value (e.g. is empty).
- `Operators`: All operators (e.g. add, subtract).
- `Errors`: Handle problems (e.g. catch error, remove warnings).
