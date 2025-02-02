# WizzCloud Project Documentation

## Overview

WizzCloud is a cloud-based file storage system designed with a layered architecture following best practices for separation of concerns. The system consists of three core layers: **DTO (Controller Layer)**, **Domain (Service Layer)**, and **Entity (Repository Layer)**. It also integrates with AWS S3 for cloud storage and supports local storage for development environments.

## Architecture

### Layers

1. **DTO (Controller Layer)**: Handles HTTP requests and responses. Defines data transfer objects (DTOs) to ensure data integrity between the client and server.
2. **Domain (Service Layer)**: Contains the core business logic of the application.
3. **Entity (Repository Layer)**: Manages database interactions and persistence logic.

### Modules

- **Auth Module**: Manages user authentication, interacting with the User and Session modules.
- **User Module**: Handles user-related operations.
- **Session Module**: Manages user sessions, including refresh token mechanisms.
- **Content Module**: Handles file uploads, downloads, and content management.

### Adapters

Adapters are used to transform data between different layers:

- **ContentAdapter**: Converts data between DTO, Domain, and Entity representations.
- Adapters implement specific interfaces like `ContentAdapterInterface` to ensure consistency.

### Interfaces

The project is interface-driven to promote flexibility and maintainability:

- `repo.interface.ts`
- `service.interface.ts`
- `adapter.interface.ts`
- `storage.interface.ts`

### Inheritance

- All entities inherit from `abstract.entity`.
- Adapters inherit from `domain.adapter`.

## Authentication & Authorization

- Uses **JWT (JSON Web Tokens)** for access and refresh tokens.
- **JWT Guards/Strategies** validate bearer tokens.
- Tokens are refreshed automatically, and users must re-login when both tokens expire.

## Account Verification

Account verification is implemented via email using **Nodemailer**. Upon registration, users receive a verification code to confirm their email address.

## Storage Architecture

- **AWS S3 Integration**: Supports JPEG, PNG, and PDF file uploads up to 10 MB.

- **Local Storage (in development)**: Can switch between AWS and local storage using dependency injection:

  ```typescript
  @Inject(AwsService) private readonly storage: StorageInterface
  ```

  To switch to local storage, replace `AwsService` with `LocalStorageService`.

- **Presigned URLs**: Generated for secure file access, automatically refreshed using **Bull** and **Redis**.

## Frontend

- Built with **React** using `useState` and `useEffect` for state management and side effects.
- Interacts with the backend via API calls

## Docker & Deployment

The project uses **Docker** for containerization and **docker-compose** for service orchestration:

### Services

- **Backend**: Node.js application with NestJS.
- **Frontend**: React application.
- **Database**: PostgreSQL.
- **Redis**: For caching and background job processing.
- **Migrations**: Managed using `migrate/migrate`.

## Diagrams

### System Architecture

```
[Client] → [Controller (DTO)] → [Service (Domain)] → [Repository (Entity)] → [Database]
                                   ↓
                            [AWS S3/Local Storage]
                                   ↓
                               [Redis + Bull]
```

## Project Status

**Note:** This project is a **pet project** and is currently **under active development**. Some features, like local storage, are not fully implemented.

## Future Improvements

- Complete local storage implementation.
- Enhance frontend UI/UX.
- Add comprehensive unit and integration tests.
- Implement role-based access control (RBAC).


