# Staff Portal Testing Guide

## 🎯 What Was Fixed

### ✅ Frontend Changes:
1. **StaffLoginCard.tsx**: Fixed PIN input from 4 digits to 6 digits
2. **StaffSignInCodeCard.tsx**: Updated PIN_LENGTH constant to 6
3. **AddStaffModal.tsx**: Fixed success message display (was checking for "-" prefix incorrectly)
4. **Staff.tsx**: 
   - Now fetches salon name from database
   - Generates slug from salon name (e.g., "Lux Salon" → "lux-salon")
   - Passes real `salonSlug` to AddStaffModal

### ✅ Backend (Already Working):
- Email sending via `stygo.notification@gmail.com`
- 4-digit staff code generation
- PIN setup token generation
- Staff invitation email with setup link and login link

---

## 📋 Complete Flow to Test

### **Step 1: Add Staff (As Salon Owner)**

1. **Login as salon owner** at:
   ```
   http://localhost:3000/admin/salon-dashboard
   ```

2. **Navigate to "Staffs" tab**

3. **Click "Add New Staff"** button

4. **Fill out the form:**
   - First Name: `John`
   - Last Name: `Smith`
   - Email: `your-test-email@gmail.com` (use a real email you can access)
   - Phone: `1234567890`
   - Staff Role: Select from dropdown (e.g., "Hair Stylist")
   - Specializations: Check boxes (e.g., "Hair Cutting", "Hair Coloring")

5. **Click "Add Staff"**

6. **Expected Result:**
   - Green success message: "Staff added! Code XXXX emailed from stygo.notification@gmail.com."
   - Staff appears in the list

---

### **Step 2: Check Email (As New Staff Member)**

1. **Open your test email inbox**

2. **Look for email from**: `stygo.notification@gmail.com`

3. **Email should contain:**
   - Welcome message
   - Your 4-digit Staff ID: **`1234`** (example)
   - **"Set Your PIN"** button/link
   - Login link: `http://localhost:3000/salon/lux-salon/staff/login`

---

### **Step 3: Set Your PIN (First Time Setup)**

1. **Click the "Set Your PIN" link** from the email
   - Should navigate to: `http://localhost:3000/salon/lux-salon/staff/sign-in-code?token=...`

2. **The token should be auto-filled** from the URL

3. **Create a 6-digit PIN:**
   - Create PIN: `123456`
   - Confirm PIN: `123456`

4. **Click "Save PIN"**

5. **Expected Result:**
   - Green success message: "PIN saved! You can now log in with your staff code."

---

### **Step 4: Login to Staff Portal**

1. **Navigate to the login link** (or from email):
   ```
   http://localhost:3000/salon/lux-salon/staff/login
   ```

2. **Enter your credentials:**
   - Staff Code: `1234` (4 digits from email)
   - PIN: `123456` (6 digits you created)

3. **Click "Enter Portal"**

4. **Expected Result:**
   - Success message: "Login successful! Staff portal access coming soon."
   - (Future: Should redirect to staff portal dashboard)

---

## 🔧 Backend Environment Variables Needed

Make sure these are set in your `.env`:

```env
# Email service (for sending invitations)
EMAIL_USER=stygo.notification@gmail.com
EMAIL_PASS=your_app_password

# Frontend URL (for generating links in email)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 🧪 Things to Verify

- [ ] Email is received with correct staff code
- [ ] Setup link works and token is auto-filled
- [ ] PIN must be exactly 6 digits
- [ ] PIN confirmation must match
- [ ] Login requires 4-digit code + 6-digit PIN
- [ ] Error messages display correctly for wrong credentials
- [ ] Success messages are green, error messages are red

---

## 🐛 Common Issues

### Email not received?
- Check spam/junk folder
- Verify `EMAIL_USER` and `EMAIL_PASS` in backend `.env`
- Check backend console for email sending errors

### "Invalid token" error?
- Token expires after some time (check `staff_pin_tokens` table)
- Make sure you're using the full URL from the email

### Login fails?
- Verify staff code is exactly 4 digits
- Verify PIN is exactly 6 digits
- Check that PIN was set successfully (check `staff` table `pin_hash` column)

---

## 📊 Database Verification

### Check if staff was created:
```sql
SELECT s.staff_id, s.staff_code, u.full_name, u.email, s.pin_hash IS NOT NULL as has_pin
FROM staff s
JOIN users u ON s.user_id = u.user_id
WHERE u.email = 'your-test-email@gmail.com';
```

### Check PIN setup token:
```sql
SELECT * FROM staff_pin_tokens WHERE staff_id = <staff_id>;
```

---

## ✅ Next Steps (Future Implementation)

After successful login, the staff portal should:
- Show staff dashboard with appointments
- Allow checking in/out
- View their schedule
- Update appointment status
- View customer notes

---

**Note**: The slug generation creates URL-friendly names from salon names (e.g., "Lux Salon" → "lux-salon", "Hair & Beauty Co." → "hair-beauty-co").

