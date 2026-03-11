-- Drop existing restrictive policies on students
DROP POLICY IF EXISTS "Anyone can delete students" ON public.students;
DROP POLICY IF EXISTS "Anyone can insert students" ON public.students;
DROP POLICY IF EXISTS "Anyone can read students" ON public.students;
DROP POLICY IF EXISTS "Anyone can update students" ON public.students;

-- Drop existing restrictive policies on attendance_records
DROP POLICY IF EXISTS "Anyone can delete attendance" ON public.attendance_records;
DROP POLICY IF EXISTS "Anyone can insert attendance" ON public.attendance_records;
DROP POLICY IF EXISTS "Anyone can read attendance" ON public.attendance_records;

-- Students: everyone can read (edge function needs it), only authenticated can modify
CREATE POLICY "Anyone can read students" ON public.students FOR SELECT USING (true);
CREATE POLICY "Authenticated can insert students" ON public.students FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated can update students" ON public.students FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated can delete students" ON public.students FOR DELETE TO authenticated USING (true);

-- Attendance: anyone can insert (face scan), only authenticated can read/delete
CREATE POLICY "Anyone can insert attendance" ON public.attendance_records FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated can read attendance" ON public.attendance_records FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can delete attendance" ON public.attendance_records FOR DELETE TO authenticated USING (true);