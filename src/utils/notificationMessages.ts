export const acceptanceMessage = (eventName: string, taskName: string) =>
  `Congratulations!\nYour application for the task "${taskName}" at event "${eventName}" has been accepted.`;

export const rejectionMessage = (eventName: string, taskName: string) =>
  `We regret to inform you that your application for the task "${taskName}" at event "${eventName}" has not been accepted.`;

export const evaluationMessage = (eventName: string, rating: number) =>
  `Thank you for volunteering at the "${
    eventName || ''
  }" event!\nYour activities have been evaluated, and you received a rating of "${rating}".\nWe hope you had a great time and look forward to seeing you again!`;

export const removalNotification = (orgName: string) =>
  `We regret to inform you that you have been removed from the organization "${orgName}".`;

export const promotionNotification = (orgName: string, roleName: string) =>
  `Congratulations! You have been promoted to "${roleName}" role in the organization "${orgName}".`;
