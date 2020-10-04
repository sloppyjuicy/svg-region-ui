import type { HashMap } from "./types";


/**
 * Get URL paramters from hash or query string
 */
export function getFragments(): HashMap<string> {
    const hash = location.hash ? location.hash.slice(1) : location.href.split('#')[1] || '';
    let query = location.search ? location.search.slice(1) : location.href.split('?')[1] || '';
    let hash_fragments = {};
    if (hash) {
        // Hash can also contain the query so we need to check for it
        if (hash.indexOf('?') >= 0) {
            const parts = hash.split('?');
            hash_fragments = convertPairStringToMap(parts[0]);
            /* istanbul ignore else */
            if (!query) {
                query = parts[1];
            }
        } else {
            hash_fragments = convertPairStringToMap(hash);
        }
    }
    let query_fragments = {};
    if (query) {
        query_fragments = convertPairStringToMap(query);
    }
    return { ...hash_fragments, ...query_fragments };
}

/**
 * Convert string of key value pairs to a dictionary object
 * @param str String of values
 */
export function convertPairStringToMap(str: string): HashMap<string> {
    const map: HashMap<string> = {};
    const str_pairs = str.split('&');
    for (const str_pair of str_pairs) {
        const split_pair = str_pair.split('=');
        if (split_pair[1]) {
            map[decodeURIComponent(split_pair[0])] = decodeURIComponent(
                split_pair[1]
            );
        }
    }
    return map;
}
