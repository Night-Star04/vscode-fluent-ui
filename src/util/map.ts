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
    return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}
