/**
 * Maps a value from one range to another.
 * @param value The value to map.
 * @param inMin The minimum of the input range.
 * @param inMax The maximum of the input range.
 * @param outMin The minimum of the output range.
 * @param outMax The maximum of the output range.
 * @returns The mapped value.
 */

export default function map(
    value: number,
    inMin: number,
    inMax: number,
    outMin: number,
    outMax: number,
) {
    if (inMin === inMax) {
        // Avoid division by zero when the input range is degenerate.
        // Returning outMin provides a deterministic, finite result.
        return outMin;
    }
    if (outMin === outMax) {
        // If the output range is degenerate, return the constant output value.
        return outMin;
    }
    return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}
