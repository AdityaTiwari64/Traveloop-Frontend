# Traveloop Manual Testing Checklist

Comprehensive checklist for testing the Traveloop REST API.

## 1. Authentication & Authorization
- [ ] **Registration**: Create a new user (Payload: `name`, `email`, `password`).
- [ ] **Login**: Obtain JWT token (Payload: `email`, `password`).
- [ ] **Token Validation**: Access protected route with valid token.
- [ ] **Access Denied**: Access protected route without token (401).
- [ ] **Invalid Token**: Access with malformed or expired token (401).
- [ ] **Admin Restriction**: Regular user attempts to access `/api/admin/*` (403).
- [ ] **Admin Access**: Admin user successfully accesses `/api/admin/*`.

## 2. User Profile Management
- [ ] **Get Me**: Retrieve own profile data.
- [ ] **Update Me**: Change `name`, `language`, or `profile_photo`.
- [ ] **Profile Photo**: Upload a photo via Multer (multipart/form-data).
- [ ] **Saved Destinations**: Add city to saved list.
- [ ] **Delete Saved**: Remove city from saved list.
- [ ] **Account Deletion**: Delete own account and verify login fails.

## 3. Cities & Activities
- [ ] **List Cities**: Get all cities.
- [ ] **Filter Cities**: Filter by region (e.g., `?region=Asia`).
- [ ] **Sort Cities**: Sort by `cost_index` or `popularity_score`.
- [ ] **Search Cities**: Search by name (e.g., `?q=paris`).
- [ ] **City Details**: Get specific city by ID.
- [ ] **List Activities**: Filter by `city_id`, `category`, and `max_cost`.
- [ ] **Activity Details**: Get specific activity by ID.

## 4. Trip Management (CRUD)
- [ ] **Create Trip**: Create trip (Payload: `name`, `description`, `start_date`, `end_date`).
- [ ] **List Trips**: Verify only own trips are returned.
- [ ] **Trip Details**: Retrieve specific trip by UUID.
- [ ] **Update Trip**: Modify trip metadata.
- [ ] **Delete Trip**: Remove trip and verify it's gone.
- [ ] **Ownership Check**: User A attempts to GET/PUT/DELETE User B's trip (404/403).

## 5. Itinerary (Stops & Activities)
- [ ] **Add Stop**: Add city to trip itinerary.
- [ ] **Update Stop**: Change dates or order.
- [ ] **Delete Stop**: Remove city from itinerary.
- [ ] **Add Activity**: Add specific activity to a trip stop.
- [ ] **Remove Activity**: Remove activity from a trip stop.

## 6. Budget, Packing & Notes
- [ ] **Budget Breakdown**: View breakdown for a trip.
- [ ] **Update Budget**: Set total budget and currency.
- [ ] **Budget Alerts**: Check for over-budget alerts.
- [ ] **Packing List**: View checklist items.
- [ ] **Add Packing Item**: Add new item to list.
- [ ] **Toggle Packed**: Mark item as packed/unpacked.
- [ ] **Trip Notes**: Add, update, and delete notes.

## 7. Public Sharing
- [ ] **Share Trip**: Generate share token and mark trip as public.
- [ ] **Public View**: Access `/api/trips/public/:share_token` without Bearer token.
- [ ] **Private Link**: Attempt to access public route with invalid token (404).

## 8. Edge Case Scenarios
- [ ] **Invalid Dates**: Create trip with `end_date` before `start_date` (should fail).
- [ ] **Out of Range Stop**: Add stop with dates outside trip range (should fail).
- [ ] **Checklist Completion**: Mark all items as packed.
- [ ] **Ownership**: Access User B's private trip directly via UUID (should return 403/404).
- [ ] **Large Uploads**: Attempt to upload photo > 5MB (should fail).
- [ ] **Admin Overlook**: Admin views list of all users and all trips.

## 9. Validation & Errors
- [ ] **Missing Fields**: Submit POST requests with missing required fields (400).
- [ ] **Type Mismatch**: Submit string for integer ID (400).
- [ ] **Invalid UUID**: Submit malformed UUID for trip ID (400).
- [ ] **Resource Not Found**: Access non-existent ID (404).
