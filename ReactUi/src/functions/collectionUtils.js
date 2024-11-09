
export function getCollectionMeta(userId) {
    return {
        key: userId,
        name: 'Personal Collection for ' + userId,
        description: "User file storage",
        isRetired: false
    };
}