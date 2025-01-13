import React from 'react'

const categories = [
    {
        name: "Electronics",
        value: "electronics",
    },
    {
        name: "Books",
        value: "books",
    },
    {
        name: "Instruments",
        value: "instruments,"
    },
    {
        name: "Notes",
        value: "notes",
    },
    {
        name: "Others",
        value: "others",
    },
];

const yearsused = [
    {
        name: "0-2 years used",
        value: "0-2",
    },
    {
        name: "3-5 years used",
        value: "3-5",
    },
    {
        name: "6-8 years used",
        value: "6-8",
    },
    {
        name: "9-10 years used",
        value: "9-10",
    },
    {
        name: "10+ years used",
        value: "10-20",
    }
];


function Filters({ showFilters,
    setShowFilters,
    filters,
    setFilters
}) {
    return (
        <div className="w-72 flex flex-col">
            <div className="flex justify-between">
                <h1 className="text-xl">Filters</h1>
                <i className="ri-close-line text-xl cursor-pointer"
                    onClick={() => setShowFilters(!showFilters)}></i>
            </div>

            <div className='flex flex-col gap-1 mt-5'>
                <h1 className='text-gray-600'>Categories</h1>
                <div className="flex flex-col gap-1">
                    {categories.map((category) => {

                        return (
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    name="category"
                                    className="max-width"
                                    checked={filters.category.includes(category.value)}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setFilters({
                                                ...filters,
                                                category: [...filters.category, category.value],
                                            });
                                        } else {
                                            setFilters({
                                                ...filters,
                                                category: filters.category.filter(
                                                    (item) => item !== category.value
                                                ),
                                            });
                                        }
                                    }}
                                />
                                <label htmlFor="category">{category.name}</label>
                            </div>
                        );
                    })}
                </div>
            </div>

            <h1 className='text-gray-600 mt-5'>Years Used</h1>
            <div className="flex flex-col gap-1">
                {yearsused.map((yearsused) => {
                    return (
                        <div className="flex gap-2 items-center">
                            <input
                                type="checkbox"
                                name="yearsused"
                                className="max-width"
                                checked={filters.yearsused.includes(yearsused.value)}
                                onChange={(e) => {
                                    if (e.target.checked) {
                                        setFilters({
                                            ...filters,
                                            yearsused: [...filters.yearsused, yearsused.value],

                                        });
                                    } else {
                                        setFilters({
                                            ...filters,
                                            yearsused: filters.yearsused.filter(
                                                (item) => item !== yearsused.value
                                            ),
                                        });
                                    }
                                }}
                            />
                            <label htmlFor="yearsused">{yearsused.name}</label>
                        </div>
                    );
                })}
            </div>
        </div>
    )
}

export default Filters




