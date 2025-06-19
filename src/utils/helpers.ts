/* eslint-disable no-shadow */
import { OrganizationMember } from '../models/organization';
import { Ability } from '../models/skill';

export function monogram(
  firstName: string | undefined,
  lastName: string | undefined,
): string {
  return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
}

export function roundNumber(num: number | undefined): number | undefined {
  return typeof num === 'number' ? parseFloat(num.toFixed(1)) : undefined;
}

export function getOwnAbilities<T extends Ability>(
  abilities1: T[] | undefined = [],
  abilities2: T[] | undefined = [],
): T[] {
  const uniqueAbilities = abilities2.filter(
    (ability2) => !abilities1.some((ability1) => ability1.id === ability2.id),
  );

  return uniqueAbilities;
}

export const eventImagePlaceholder =
  'https://media.istockphoto.com/id/978975308/vector/upcoming-events-neon-signs-vector-upcoming-events-design-template-neon-sign-light-banner-neon.jpg?s=612x612&w=0&k=20&c=VMCoJJda9L17HVkFOFB3fyDpjC4Qu2AsyYn3u4T4F4c=';

export const orgLogoPlaceholder =
  'https://png.pngtree.com/templates/20180813/community-organization-logo-design-template-png_28632.jpg';

export function findVolunteerIdByEmail(
  userEmail: string | undefined,
  organizationMembers: OrganizationMember[] | undefined,
): number | undefined {
  const foundMember = organizationMembers?.find(
    (member) => member.email === userEmail,
  );
  return foundMember ? foundMember.volunteerId : undefined;
}
