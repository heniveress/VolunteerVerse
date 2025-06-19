# VolunteerVerse: Client-side implementation of a volunteer coordination platform

## Table of Contents

* [About the project](#about-the-project)
* [Features](#features)
* [Technologies used](#technologies-used)
* [Demo](#demo)
  
---

## About the poject

This project, **VolunteerVerse**, represents the client-side (frontend) implementation of a volunteer coordination platform. It is developed as a Single-Page Application (SPA) designed to facilitate the connection between individuals willing to volunteer and organizations or events in need of volunteers. The platform aims to streamline the process of finding, applying for, and managing volunteer opportunities, as well as enabling organizations to create and manage their events and volunteers.

---

## Features

The VolunteerVerse frontend provides a comprehensive set of functionalities for both volunteers and organizations:

**User management:**

* **Registration:** Separate registration flows for individual volunteers and organizations.
* **Login:** Secure user authentication for registered users, including **Google Login** integration.
* **Password management:** Ability to change user passwords.
* **Profile management:** Users can modify their account details and personal information.
* **Account deletion:** Option for users to delete their accounts.

**Event management (volunteer perspective):**

* **Event listing:** Browse a comprehensive list of available volunteer opportunities.
* **Event search & filtering:** Search for events by name, date, or location.
* **Event application:** Apply to specific volunteer events.
* **Application management:** View and manage their applied-for events.
* **Application cancellation:** Ability to withdraw from an event they have previously applied for.

**Event management (organization perspective):**

* **Event creation:** Organizations can create new volunteer events, providing all necessary details.
* **Event editing:** Modify existing event details.
* **Event deletion:** Remove events that are no longer needed.
* **Volunteer listing:** View a list of volunteers who have applied for their events.

**Review functionality:**

* **Volunteer reviews:** Volunteers can write and submit reviews about events they have participated in.
* **Organization reviews:** Organizations can write and submit reviews about volunteers who participated in their events.

**Notification system:**

* **Event acceptance notifications:** Users receive notifications when their application for an event is accepted.
* **Review notifications:** Users receive notifications when a review is written about them (volunteer) or their event (organization).

**Participation documentation:**

* **Participation certificates:** After participating in a volunteer event, users can download a document from their profile page. This document precisely details their involvement, including the event name, date(s) of participation, and total hours contributed.

---

## Technologies used

The frontend of VolunteerVerse is built using modern web technologies to ensure a responsive, efficient, and user-friendly experience:

* **[React](https://react.dev/):** A JavaScript library for building user interfaces.
* **[Material-UI (MUI)](https://mui.com/):** A comprehensive suite of UI tools to implement Google's Material Design.
* **[React Router](https://reactrouter.com/):** For declarative routing in the React application.
* **[Formik](https://formik.org/):** A small helper for building forms in React, helping with validation and form state.
* **[Yup](https://github.com/jquense/yup):** A JavaScript schema builder for value parsing and validation.
* **[SWR](https://swr.vercel.app/):** A React Hooks library for data fetching, caching, and revalidation.
* **[Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API):** For making network requests to the backend API.
* **[npm](https://docs.npmjs.com/):** Node Package Manager for managing project dependencies.

---

## Demo

Since the application is unfortunately no longer running on Azure, the following demo videos and project presentation provide a visual insight into how the website looks and functions.

For a more detailed understanding, you can explore the individual video clips located in the [`assets/demo_videos/` folder](assets/demo_videos/), or the [VolunteerVerse PPT](assets/VolunteerVerse.ppt)
