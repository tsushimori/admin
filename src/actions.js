export function openPersonalMenu(bool) {
    return {
        type: 'OPEN_PERSONAL_MENU',
        bool
    }
}
export function currentHeaderNav(arr) {
    return {
        type: 'CURRENT_HEADER_NAV',
        arr
    }
}
export function changeMainSec(arr) {
    return {
        type: 'CHANGE_MAIN_SEC',
        arr
    }
}
