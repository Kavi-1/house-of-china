import { useState } from "react";
import { supabase } from '@/lib/supabaseClient';
import { useCart } from './CartContext';

interface MenuItem {
  id: string | number;
  name: string;
  description: string;
  category: string;
  price: number;
}

interface MenuClientProps {
  menuItems: MenuItem[];
  categories: string[];
  error?: unknown;
}
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';
import CategorySidebar from './CategorySidebar';

export default function MenuClient({ menuItems, categories, error }: MenuClientProps) {
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [options, setOptions] = useState<{ id?: number; name?: string; price?: number }[]>([]);
  const [selectedOptionIds, setSelectedOptionIds] = useState<number[]>([]);
  const [quantity, setQuantity] = useState<number>(1);
  const { addToCart } = useCart();

  // get the options for each category
  const handleCardClick = async (item: MenuItem) => {
    setSelectedItem(item);
    setModalOpen(true);
    setOptions([]);
    setSelectedOptionIds([]);
    setQuantity(1);
    const { data, error } = await supabase
      .from('category_options')
      .select('options(id, name, price)')
      .eq('category', item.category);
    if (error) {
      setOptions([]);
      return;
    }

    type OptionShape = { id?: number; name?: string; price?: number };
    const rows = (data || []) as unknown as { options?: OptionShape[] }[];
    const opts = rows.flatMap(row => row.options ?? []);
    setOptions(opts);
  };

  const handleClose = () => {
    setModalOpen(false);
    setSelectedItem(null);
    setOptions([]);
    setSelectedOptionIds([]);
    setQuantity(1);
  };

  const handleAddToCart = () => {
    if (!selectedItem) return;
    const selectedOption = options.find(o => o.id === selectedOptionIds[0]);
    addToCart({
      id: selectedItem.id,
      name: selectedItem.name,
      basePrice: selectedItem.price,
      optionId: selectedOption?.id || null,
      optionName: selectedOption?.name || null,
      optionPrice: selectedOption?.price || 0,
      total: ((Number(selectedItem.price) + (selectedOption?.price || 0)) * quantity),
      quantity: quantity
    });
    setModalOpen(false);
  };

  const errorString = error ? String(error) : null;

  return (
    <main className="font-poppins max-w-7xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Menu</h1>
      {errorString && <div className="text-red-500 mb-4">Error loading menu: {errorString}</div>}

      <div className="lg:flex lg:gap-6 h-full">
        <div className="lg:w-48 lg:flex-none">
          <CategorySidebar categories={categories} />
        </div>

        <div className="flex-1">
          {categories.map((category: string) => {
            // for category images
            const categoryMap: Record<string, string> = {
              "Combination": 'Combination.jpg',
              "Soup": 'soup.jpg',
              "Seafood": 'seafood.jpg',
              "Fish": 'fish.jpg',
              "Beef": 'beef.jpg',
              "Chef's Special": 'chefs-special.jpg',
              "Chicken": 'chicken.jpg',
              "Roast Pork": 'roastpork.jpg',
              "Appetizers": 'Appetizers.jpg',
              "Vegetable": 'vegetables.jpg',
              "Nutrition & Healthy Food": 'nutrition.jpg',
              "Fried Rice": 'Friedrice.jpg',
              "Mei Fun": "meifun.jpg",
              "Soft Noodles": "lomein.jpg",
              "Chow Mein (Soft Vegetables) or Chop Suey": "chowmein.jpg",
              "Egg Foo Young": "eggfooyoung.jpg",
              "Side Order": "sideorders.jpg",
            }

            const mapped = categoryMap[category]
            const imagePath = `/images/categories/${mapped}`
            return (
              <section id={`cat-${category}`} key={category} className="mb-8">
                <div className="relative w-full h-40 mb-4 rounded-lg overflow-hidden">
                  <img
                    src={imagePath}
                    alt={category}
                    onError={(e) => { (e.target as HTMLImageElement).src = '/file.svg' }}
                    className="object-cover w-full h-full z-0"
                  />
                  <div className="absolute inset-0 flex items-stretch justify-start z-10">
                    <div className="h-full w-full flex items-center">
                      <div className="h-full w-full bg-gradient-to-r from-black/80 to-transparent w-1/3 max-w-[420px] p-4 md:p-6 flex items-center z-10">
                        <h2 className="text-3xl font-bold text-white drop-shadow text-left">{category}</h2>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="font-poppins grid gap-6 grid-cols-2 lg:grid-cols-4">
                  {menuItems?.filter((item: MenuItem) => item.category === category).map((item: MenuItem) => (
                    <div
                      key={item.id}
                      className="border rounded-lg overflow-hidden shadow-sm cursor-pointer hover:shadow-lg hover:scale-102 transform transition-transform transition-shadow flex flex-col"
                      style={{ height: '100px', minHeight: '100px' }}
                      onClick={() => handleCardClick(item)}
                    >
                      <div className="p-4 mt-0 pt-2 flex-1 flex flex-col justify-between" style={{ height: '40%' }}>
                        <h3 className="text-md font-semibold mb-2">{item.name}</h3>
                        {/* <p className="mb-2 flex-1">{item.description}</p> */}
                        <div className="bg-red-200 max-w-15 min-h-7 flex justify-center items-center text-sm font-bold rounded-full">${item.price}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>

      <Dialog open={modalOpen} onClose={handleClose} sx={{ '& .MuiDialog-paper': { width: 400, borderRadius: '12px' } }}>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '2rem', letterSpacing: '-1px' }}>
            {selectedItem?.name}
          </span>
          <IconButton aria-label="close" onClick={handleClose} sx={{ color: '#888', ml: 'auto' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <div className="mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>{selectedItem?.description}</div>
          <div className="font-bold mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
            ${
              selectedItem
                ? ((Number(selectedItem.price) + (options.find(o => o.id === selectedOptionIds[0])?.price || 0)) * quantity).toFixed(2)
                : '0.00'
            }
          </div>

          {/* select amount */}
          <div className="font-poppins flex items-center gap-3 mb-4">
            <div className="font-semibold">Quantity</div>
            <div className="flex items-center border rounded-full overflow-hidden">
              <button
                aria-label="decrease"
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200"
              >
                −
              </button>
              <input
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => {
                  const v = Number(e.target.value) || 1
                  setQuantity(Math.max(1, Math.floor(v)))
                }}
                className="w-16 text-center p-1 no-spinner"
              />
              <button
                aria-label="increase"
                onClick={() => setQuantity(q => q + 1)}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200"
              >
                +
              </button>
            </div>
          </div>

          {/* options for each category */}
          {options.length > 0 && (
            <div className="mb-4">
              <div className="font-semibold mb-2">Options:</div>
              <div className="flex flex-wrap gap-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                {options.map(option => (
                  <label
                    key={option.id}
                    className={`flex items-center px-4 py-2 rounded-full border cursor-pointer transition whitespace-nowrap min-w-0
                        ${option.id !== undefined && selectedOptionIds.includes(option.id as number)
                        ? 'bg-red-100 text-black border-red-300'
                        : 'bg-white text-gray-800 border-gray-300 hover:bg-red-50'}
                    `}
                    style={{ maxWidth: '100%' }}
                  >
                    <input
                      type="radio"
                      name="option-group"
                      checked={option.id !== undefined && selectedOptionIds.includes(option.id as number)}
                      onChange={() => option.id !== undefined && setSelectedOptionIds([option.id as number])}
                      className="hidden"
                    />
                    <span className="font-medium truncate">{option.name}</span>
                    {option.price !== 0 && (
                      <span className="ml-2 text-sm">+${Number(option.price).toFixed(2)}</span>
                    )}
                  </label>
                ))}
              </div>
            </div>
          )}



          <Button
            variant="contained"
            fullWidth
            sx={{
              backgroundColor: '#ff3c5dff',
              color: '#fff',
              fontWeight: 'normal',
              mt: 2,
              fontFamily: 'Poppins, sans-serif',
              fontSize: '1.1rem',
              textTransform: 'none',
              letterSpacing: '-0.5px',
              borderRadius: '50px',
              '&:hover': { backgroundColor: '#ff0000ff' }
            }}
            onClick={handleAddToCart}
          >
            Add to Cart
          </Button>

        </DialogContent>
      </Dialog>
    </main>
  );
}
