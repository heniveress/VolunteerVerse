/* eslint-disable no-shadow */
export enum OrgRoles {
  NoRole = -1,
  OrganizationMember = 0,
  EventAdmin = 1,
  OrganizationAdmin = 2,
  OrganizationOwner = 3,
  GlobalAdmin = 4,
}

export function isOwner(roleInOrganization?: number): boolean {
  return roleInOrganization === OrgRoles.OrganizationOwner;
}

export function isOrgAdmin(roleInOrganization?: number): boolean {
  return roleInOrganization === OrgRoles.OrganizationAdmin;
}

export function isMinOrgAdmin(roleInOrganization?: number): boolean {
  return (roleInOrganization ?? -1) >= OrgRoles.OrganizationAdmin;
}

export function isMaxEventAdmin(roleInOrganization?: number): boolean {
  return (roleInOrganization ?? -1) <= OrgRoles.EventAdmin;
}

export function isMinOrgMember(roleInOrganization?: number): boolean {
  return (roleInOrganization ?? -1) >= OrgRoles.OrganizationMember;
}

export function isMinEventAdmin(roleInOrganization?: number): boolean {
  return (roleInOrganization ?? -1) >= OrgRoles.EventAdmin;
}

export function getRoleName(roleInOrganization?: number): string {
  switch (roleInOrganization) {
    case OrgRoles.OrganizationMember:
      return 'Member';
    case OrgRoles.EventAdmin:
      return 'Event Admin';
    case OrgRoles.OrganizationAdmin:
      return 'Org. Admin';
    case OrgRoles.OrganizationOwner:
      return 'Owner';
    case OrgRoles.GlobalAdmin:
      return 'Global Admin';
    default:
      return 'No Role';
  }
}
