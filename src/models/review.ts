import { VolunteerInfoForReview } from './volunteer';

export interface CreateReview {
  volunteerId: number;
  eventId: number;
  rating: number;
  comment: string;
}

export interface VolunteerReviewFromEvent {
  id: number;
  eventId: number;
  event: {
    id: number;
    name: string;
    description: string;
    location: string;
    startTime: Date;
    imageUri: string;
  };
  rating: number;
  comment: string;
  reviewTime: Date;
}

export interface EventReviewFromVolunteer {
  id: number;
  volunteerId: number;
  Volunteer: VolunteerInfoForReview;
  rating: number;
  comment: string;
  reviewTime: Date;
}

export interface EventReviewForOrg {
  id: number;
  name: string;
  description: string;
  location: string;
  startTime: Date;
  imageUri: string;
  reviews: EventReviewFromVolunteer[];
}
