

export function NavigateToChat(user,claims,router){
    const sortedIds = [parseInt(user.user_id), parseInt(claims.user_id)].sort((a, b) => a - b);
  
  
    const roomId = `${sortedIds[0]}${sortedIds[1]}`;
    router.push(`/chat/${roomId}?uid=${user.user_id}`)
}