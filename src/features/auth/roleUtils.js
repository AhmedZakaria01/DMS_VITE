// roleUtils.js
export const hasAdminRole = (roles) => {
  return roles.includes('Admin');
};

export const hasUserRole = (roles) => {
  return roles.includes('User');
};

export const hasAnyRole = (roles, requiredRoles) => {
  return requiredRoles.some(role => roles.includes(role));
};

export const hasAllRoles = (roles, requiredRoles) => {
  return requiredRoles.every(role => roles.includes(role));
};