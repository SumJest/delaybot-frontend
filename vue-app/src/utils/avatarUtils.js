// Импорт всех аватарок из assets/avatars/
const avatarModules = import.meta.glob('@/assets/avatars/*.{png,jpg,jpeg,webp}', {
    eager: true,
    import: 'default'
})

const defaultAvatars = Object.values(avatarModules)

/**
 * Получить дефолтную аватарку по userId
 * @param {number} userId
 * @returns {string} URL аватарки
 */
export function getDefaultAvatar(userId) {
    const index = userId % defaultAvatars.length
    return defaultAvatars[index]
}

/**
 * Получить финальный URL аватарки: кастомная или дефолтная
 * @param {number} userId
 * @param {string|null} userAvatar
 * @returns {string}
 */
export function getUserAvatar(userId, userAvatar) {
    return userAvatar || getDefaultAvatar(userId)
}
