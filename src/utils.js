const action = (x, e) => [x, e];
const effect = ({ fx }, disp) => fx.forEach(e => disp(action, e));

export const BatchEffects = fx => ({ effect, fx });
