import { supabase } from '@/lib/supabaseClient';
import Nav from '../components/Nav';
import MenuClient from '../components/MenuMain';
import Footer from '../components/Footer';

export default async function MenuPage() {
  const { data: menuItems, error } = await supabase.from('menu_items').select('*');
  type MenuRow = { category?: string };
  const raw = (menuItems || []) as MenuRow[];
  const categories = Array.from(new Set(raw.map((item) => item?.category || 'Uncategorized')));
  return (
    <>
      <Nav />
      <MenuClient menuItems={menuItems ?? []} categories={categories} error={error} />
      <Footer />
    </>
  );
}