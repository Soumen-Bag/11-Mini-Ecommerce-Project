let stockData = [];

    // CRUD API endpoint
    const apiUrl = "https://crudcrud.com/api/e954394091934be2b36ae7c08f743065/stock";

    async function addStock() {
      const productName = document.getElementById("productName").value;
      const quantity = parseInt(document.getElementById("quantity").value);
      const price = parseFloat(document.getElementById("price").value);

      const totalValue = quantity * price;

      const stockItem = {
        productName,
        quantity,
        price,
        totalValue
      };

      try {
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(stockItem),
        });

        if (response.ok) {
          stockData.push(stockItem);
          renderList();
          updateTotalValue();
          clearForm();
        } else {
          console.error("Failed to add stock item:", response.status, response.statusText);
        }
      } catch (error) {
        console.error("Error adding stock item:", error.message);
      }
    }

    async function renderList() {
      const stockList = document.getElementById("stockList");
      stockList.innerHTML = "";

      try {
        const response = await fetch(apiUrl);
        if (response.ok) {
          const data = await response.json();
          stockData = data;
          stockData.forEach((item, index) => {
            const listItem = document.createElement("li");
            listItem.textContent = `${item.productName} - Quantity: ${item.quantity} - Price per Unit: $${item.price.toFixed(2)} - Total Value: $${item.totalValue.toFixed(2)}`;

            const removeButton = document.createElement("button");
            removeButton.textContent = "Remove";
            removeButton.addEventListener("click", () => removeStock(index));

            listItem.appendChild(removeButton);
            stockList.appendChild(listItem);
          });
        } else {
          console.error("Failed to fetch stock data:", response.status, response.statusText);
        }
      } catch (error) {
        console.error("Error fetching stock data:", error.message);
      }
    }

    async function removeStock(index) {
      const stockItemId = stockData[index]._id;
      const deleteUrl = `${apiUrl}/${stockItemId}`;

      try {
        const response = await fetch(deleteUrl, {
          method: "DELETE",
        });

        if (response.ok) {
          stockData.splice(index, 1);
          renderList();
          updateTotalValue();
        } else {
          console.error("Failed to remove stock item:", response.status, response.statusText);
        }
      } catch (error) {
        console.error("Error removing stock item:", error.message);
      }
    }

    function updateTotalValue() {
      const totalStockValueElement = document.getElementById("totalStockValue");
      const totalValue = stockData.reduce((sum, item) => sum + item.totalValue, 0);
      totalStockValueElement.textContent = totalValue.toFixed(2);
    }

    function clearForm() {
      document.getElementById("stockForm").reset();
    }

    // Initial render
    renderList();