# Before & After Photos Feature - Implementation Guide

## Overview
This feature allows stylists/staff to upload before and after photos to customer appointments, and customers can view their transformation gallery in their profile.

## What Was Implemented

### 🎨 Frontend Components

#### 1. **Photo API Functions** (`libs/api/photos.ts`)
- `uploadAppointmentPhoto()` - Upload before/after photos with multipart form data
- `getAppointmentPhotos()` - Get all photos for a specific appointment  
- `getUserPhotos()` - Get all photos for the current customer
- `getPhotoUrl()` - Helper to construct full image URLs

#### 2. **Staff Photo Upload Component** (`components/Dashboard/Appointments/AppointmentPhotoUpload.tsx`)
- Upload interface with before/after toggle
- File preview before upload
- Display existing before/after photos side-by-side
- Integrated into appointment details modal
- Real-time photo upload with progress feedback

#### 3. **Customer Photo Gallery** (`components/Customer/CustomerPhotoGallery.tsx`)
- "My Photos" tab in customer profile
- Before/after photo pairs grouped by appointment
- Grid layout with thumbnail previews
- Lightbox modal for full-size viewing
- Chronological sorting (newest first)
- Empty state with helpful messaging

#### 4. **Updated Appointment Details Modal** (`components/Dashboard/Appointments/AppointmentDetailsModal.tsx`)
- Integrated photo upload component
- Wider modal (max-w-2xl) to accommodate photos
- Photos section appears below appointment details

#### 5. **Enhanced Customer Profile** (`components/Customer/CustomerMyProfileTabs.tsx`)
- Added "My Photos" tab
- Tab navigation updated to include photo gallery
- Seamless integration with existing profile tabs

### 🔧 Backend Enhancements

#### 1. **Photo Controller** (`modules/photos/controller.js`)
- Updated `addServicePhoto()` to handle file uploads via multer middleware
- Added `getUserPhotos()` endpoint for customer gallery
- Added validation for photo_type ('before' or 'after')
- Added authorization checks (customers can only view their own photos)

#### 2. **Photo Service** (`modules/photos/service.js`)
- Added `getUserPhotos()` query to fetch all user photos with appointment details
- Updated `getServicePhotos()` to sort by creation date

#### 3. **Photo Routes** (`modules/photos/routes.js`)
- Added file upload middleware to `/add` endpoint
- Added new route: `GET /api/photos/user/:user_id`
- All routes protected with authentication

## Database Schema (Already Exists)

The `service_photos` table structure:
```sql
CREATE TABLE service_photos (
  photo_id INT PRIMARY KEY AUTO_INCREMENT,
  appointment_id INT NOT NULL,
  user_id INT NOT NULL,
  staff_id INT,
  service_id INT,
  photo_type ENUM('before','after') NOT NULL,
  photo_url VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (appointment_id) REFERENCES appointments(appointment_id),
  FOREIGN KEY (user_id) REFERENCES users(user_id),
  FOREIGN KEY (staff_id) REFERENCES staff(staff_id),
  FOREIGN KEY (service_id) REFERENCES services(service_id)
);
```

## API Endpoints

### Upload Photo (Staff/Owner Only)
```
POST /api/photos/add
Authorization: Bearer <token>
Content-Type: multipart/form-data

Body:
- photo: File
- appointment_id: number
- photo_type: 'before' | 'after'
- staff_id: number (optional)
- service_id: number (optional)

Response:
{
  "message": "Photo uploaded",
  "photo_id": 123,
  "photo_url": "/uploads/filename.jpg"
}
```

### Get Appointment Photos
```
GET /api/photos/:appointment_id
Authorization: Bearer <token>

Response:
{
  "photos": [
    {
      "photo_id": 1,
      "appointment_id": 5,
      "user_id": 10,
      "staff_id": 3,
      "service_id": 7,
      "photo_type": "before",
      "photo_url": "/uploads/photo.jpg",
      "created_at": "2025-12-09T10:00:00Z"
    }
  ]
}
```

### Get User Photos (Customer Gallery)
```
GET /api/photos/user/:user_id
Authorization: Bearer <token>

Response:
{
  "photos": [
    {
      "photo_id": 1,
      "appointment_id": 5,
      "photo_type": "before",
      "photo_url": "/uploads/photo.jpg",
      "scheduled_time": "2025-11-15T14:30:00Z",
      "created_at": "2025-11-15T15:45:00Z"
    }
  ]
}
```

## User Flows

### Staff/Stylist Flow:
1. Navigate to Appointments dashboard
2. Click on any appointment to view details
3. Scroll to "Before & After Photos" section
4. Select "Before" or "After" toggle
5. Click to upload image (or drag & drop)
6. Preview appears - click "Upload Before/After Photo"
7. Photo is saved and displayed in the appointment

### Customer Flow:
1. Navigate to "My Profile" page
2. Click on "My Photos" tab
3. View grid of before/after photo pairs
4. Click any pair to open full-screen lightbox
5. Navigate between photos
6. See appointment dates for each transformation

## Features

### Staff Side:
✅ Upload before/after photos to any appointment
✅ View existing photos in appointment details
✅ Preview before uploading
✅ Photo type selection (before/after)
✅ Instant feedback on upload success/failure
✅ Side-by-side before/after comparison

### Customer Side:
✅ Dedicated "My Photos" tab in profile
✅ Grid view of all transformations
✅ Before/after pairs grouped by appointment
✅ Lightbox for full-size viewing
✅ Chronological sorting
✅ Empty state with helpful message
✅ Appointment date display

## File Structure

```
PROJECT_FRONTEND_CS490/
├── components/
│   ├── Customer/
│   │   ├── CustomerPhotoGallery.tsx (NEW)
│   │   └── CustomerMyProfileTabs.tsx (UPDATED)
│   └── Dashboard/
│       └── Appointments/
│           ├── AppointmentPhotoUpload.tsx (NEW)
│           └── AppointmentDetailsModal.tsx (UPDATED)
├── libs/
│   └── api/
│       └── photos.ts (NEW)
└── BEFORE_AFTER_PHOTOS_IMPLEMENTATION.md (THIS FILE)

CS-490-GP-Backend/
└── modules/
    └── photos/
        ├── controller.js (UPDATED)
        ├── service.js (UPDATED)
        └── routes.js (UPDATED)
```

## Testing Checklist

### Staff Testing:
- [ ] Upload a "before" photo to an appointment
- [ ] Upload an "after" photo to same appointment
- [ ] Verify photos display in appointment modal
- [ ] Check file size validation (10MB limit)
- [ ] Test with different image formats (PNG, JPG, GIF)

### Customer Testing:
- [ ] View "My Photos" tab in profile
- [ ] Verify all appointments with photos are shown
- [ ] Click on photo pair to open lightbox
- [ ] Verify empty state when no photos exist
- [ ] Check photos are sorted by date (newest first)

### Backend Testing:
- [ ] Verify photo uploads save to `/public/uploads/`
- [ ] Check database entries in `service_photos` table
- [ ] Test authorization (customers can't view others' photos)
- [ ] Verify file upload middleware works correctly

## Security Considerations

✅ Authentication required for all photo endpoints
✅ Customers can only view their own photos
✅ Staff/owners can upload photos to their salon's appointments
✅ File type validation (images only)
✅ File size limit (10MB)
✅ Secure file storage in `/public/uploads/`

## Future Enhancements (Optional)

- [ ] Photo deletion functionality
- [ ] Multiple photos per type (multiple "after" photos)
- [ ] Photo editing/cropping before upload
- [ ] Share photos on social media
- [ ] Download photos as PDF portfolio
- [ ] Photo comments/notes from stylist
- [ ] Photo comparison slider (before/after overlay)
- [ ] Print-ready photo layouts

## Notes

- Photos are stored in `/public/uploads/` directory on the backend
- Image URLs are relative (e.g., `/uploads/filename.jpg`)
- The feature uses the existing `service_photos` table (no migrations needed)
- File upload uses multer middleware (already configured)
- All components use responsive design for mobile/tablet/desktop

## Support

If you encounter any issues:
1. Check browser console for errors
2. Verify backend server is running
3. Check file permissions on `/public/uploads/` directory
4. Ensure database `service_photos` table exists
5. Verify authentication tokens are valid

