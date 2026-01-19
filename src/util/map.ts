/**
 * Maps a value from one range to another using linear interpolation.
 *
 * @param value The value to map. Note: Values outside `[inMin, inMax]` will be extrapolated
 *              linearly. Use the clamp parameter if you want to restrict output to `[outMin, outMax]`.
 * @param inMin The minimum of the input range.
 * @param inMax The maximum of the input range.
 * @param outMin The minimum of the output range.
 * @param outMax The maximum of the output range.
 * @param clamp If true, clamps the input value to `[inMin, inMax]` before mapping. Default is false.
 * @returns The mapped value. If `inMin === inMax`, returns outMin to avoid division by zero.
 */
export default function map(
    value: number,
    inMin: number,
    inMax: number,
    outMin: number,
    outMax: number,
    clamp = false,
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

    // Clamp the input value to the input range if requested
    let clampedValue: number = value;
    if (clamp) {
        clampedValue = Math.max(inMin, Math.min(inMax, value));
    }

    return ((clampedValue - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}
