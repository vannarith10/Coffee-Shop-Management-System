// components/CategoryStatus.tsx
//
import { useCategory } from "../hooks/useCategory"
import { ChartColumnStacked, Croissant, CupSoda, ShieldAlert } from 'lucide-react';


// Showing the numbers on the top of Category Tab
export default function CategoryStatus () {

    const {category} = useCategory();


    return (
        <section className="grid grid-cols-2 xl:grid-cols-4 gap-4">
            {/* =============================== */}
            {/* Total Categories */}
            {/* =============================== */}
            <div className="flex flex-col gap-4 bg-background-secondary p-6 rounded-lg border-2 border-border">
                <div className="flex justify-between">
                    <h3 className="text-text-secondary font-semibold text-sm">Total Categories</h3>
                    <ChartColumnStacked/>
                </div>
                <h2 className="font-extrabold text-4xl text-white">{category?.categories.length}</h2>
                <p className="text-xs text-text-secondary font-semibold">Active classificatioins</p>
            </div>


            {/* =============================== */}
            {/* Total Drinks */}
            {/* =============================== */}
            <div className="flex flex-col gap-4 bg-background-secondary p-6 rounded-lg border-2 border-border">
                <div className="flex justify-between">
                    <h3 className="text-text-secondary font-semibold text-sm">Drinks</h3>
                    <CupSoda/>
                </div>
                <h2 className="font-extrabold text-4xl text-blue-500">{category?.categories.filter((c) => c.category_type === "DRINK").length}</h2>
                <p className="text-xs text-text-secondary font-semibold">Beverage types</p>
            </div>



            {/* =============================== */}
            {/* Total Foods */}
            {/* =============================== */}
            <div className="flex flex-col gap-4 bg-background-secondary p-6 rounded-lg border-2 border-border">
                <div className="flex justify-between">
                    <h3 className="text-text-secondary font-semibold text-sm">Foods</h3>
                    <Croissant/>
                </div>
                <h2 className="font-extrabold text-4xl text-amber-600">{category?.categories.filter((c) => c.category_type === "FOOD").length}</h2>
                <p className="text-xs text-text-secondary font-semibold">Edible items</p>
            </div>



            {/* =============================== */}
            {/* Total Disables */}
            {/* =============================== */}
            <div className="flex flex-col gap-4 bg-background-secondary p-6 rounded-lg border-2 border-border">
                <div className="flex justify-between">
                    <h3 className="text-text-secondary font-semibold text-sm">Disable</h3>
                    <ShieldAlert/>
                </div>
                <h2 className="font-extrabold text-4xl text-text-error">{category?.categories.filter((c) => c.is_active === false).length}</h2>
                <p className="text-xs text-text-secondary font-semibold">Ingredient shortage</p>
            </div>
        </section>
    )
}