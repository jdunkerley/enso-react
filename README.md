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
