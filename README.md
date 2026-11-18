```bash
#supabase migration steps
npm i @supabase/supabase-js
brew install supabase/tap/supabase #npx i supabase --save-dev
supabase init #npx supabase init
supabase login #npx supabase login
supabase link --project-ref example_ref #npx supabase link --project-ref example_ref
supabase migration new m1 #npx supabase migration new m1
#write query
#open docker
supabase start
supabase db reset #npx supabase db reset
supabase gen types typescript --schema public > src/database.types.ts #npx supabase gen types typescript --schema public > database.types.ts
#on main branch after merge
supabase db reset --remote #npx supabase db reset --remote
```