
export function createElement(type, config = {}, ...children) {
    let props = {...config, children};
    return {
        // $$typeof: Symbol.for('react.element'),
        type,
        props
    }
}

export default {
    createElement
}
