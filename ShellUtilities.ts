import { Strings } from "away-strings/Strings";

/**
 * Sanitizes a string such that it can be used in sh/bash without worry. When using this string, don't wrap it inside of any additional quotes. In other words, if foo is the result of this function, write `echo foo`, not `echo "foo"` or `echo 'foo'`
 * 
 * ```
 * 3.1.2.2 Single Quotes
 * Enclosing characters in single quotes (‘'’) preserves the literal value of each character within the quotes. A single quote may not occur between single quotes, even when preceded by a backslash. 
 * ```
 * https://www.gnu.org/software/bash/manual/html_node/Single-Quotes.html
 * 
 * @returns a string with single quotes on the outside, then any single quotes on the inside appropriately handled. You can use this result in a bash script without having to worry about injection.
 * 
 * The result will look like this: 'It'\''s about time!' 
 * 
 */
export function MakeSafeSingleQuoteStringForShell(string:string){
    return `'`+ string.split(`'`).join(`'\\''`) + `'`;
}