import React, {createContext, useState, useContext, useCallback} from 'react';
import {productTreeData} from '../utils/mock';

interface Product {
  id: string;
  parent?: string;
  children?: Product[];
}

interface ProductTreeContextProps {
  selectedItems: Product[];
  toggleItem: (item: Product) => void;
}

const ProductTreeContext = createContext<ProductTreeContextProps | undefined>(
  undefined,
);

// Function to flatten the product tree data to make it accessible by id
const flattenItems = (
  items: Product[],
  parentId: string | null = null,
): Product[] => {
  return items.reduce((acc: Product[], item: Product) => {
    const newItem = {...item, parent: parentId};
    acc.push(newItem);
    if (item.children && item.children.length > 0) {
      acc.push(...flattenItems(item.children, item.id));
    }
    return acc;
  }, []);
};

const flatProductTreeData = flattenItems(productTreeData);

// Helper function to calculate the unique path identifier for an item
const getItemPathId = item => {
  let pathId = `${item.id}`;
  let parentId = item.parent;
  while (parentId !== null) {
    const parentItem = flatProductTreeData.find(i => i.id === parentId);
    pathId = `${parentItem.id}-${pathId}`;
    parentId = parentItem.parent;
  }
  return pathId;
};

// Helper function to find an item by its id in the flattened data
const findItemById = id => flatProductTreeData.find(i => i.id === id);

export const ProductTreeProvider = ({children}) => {
  const [selectedItems, setSelectedItems] = useState([]);

  const toggleItem = useCallback(item => {
    setSelectedItems(currentSelectedItems => {
      // Check if the item is already selected based on its path ID
      const currentItemPathId = getItemPathId(item);
      const isCurrentlySelected = currentSelectedItems.some(
        selectedItem => getItemPathId(selectedItem) === currentItemPathId,
      );

      let newSelectedItems = [...currentSelectedItems];

      if (isCurrentlySelected) {
        // Remove the item if it's already selected
        newSelectedItems = newSelectedItems.filter(
          selectedItem => getItemPathId(selectedItem) !== currentItemPathId,
        );
      } else {
        // Add the new item
        newSelectedItems.push(item);

        // Deselect all ancestors of the newly selected item
        let currentItem = item;
        while (currentItem.parent !== null) {
          const parentItem = findItemById(currentItem.parent);
          newSelectedItems = newSelectedItems.filter(
            selectedItem => selectedItem.id !== parentItem.id,
          );
          currentItem = parentItem;
        }

        // Deselect all descendants of the newly selected item
        const deselectDescendants = itemId => {
          const descendants = flatProductTreeData.filter(i =>
            getItemPathId(i).startsWith(
              `${getItemPathId(findItemById(itemId))}-`,
            ),
          );
          descendants.forEach(descendant => {
            newSelectedItems = newSelectedItems.filter(
              selectedItem => selectedItem.id !== descendant.id,
            );
          });
        };

        deselectDescendants(item.id);
      }
      return newSelectedItems;
    });
  }, []);

  return (
    <ProductTreeContext.Provider value={{selectedItems, toggleItem}}>
      {children}
    </ProductTreeContext.Provider>
  );
};

export const useProductTree = () => useContext(ProductTreeContext);
