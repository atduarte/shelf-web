export const Success = (value) => ({
    value,
    successful: true
})

export const Error = (value) => ({
    value,
    successful: false
});