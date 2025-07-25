document.addEventListener('DOMContentLoaded', function() { //eitu likhisu jate HTML load hua agot Javascript load nohouk
    let balance = 0;
    let initialBalance = 0;
    let totalExpenses = 0;
    let transactions = [];

    const balanceDisplay = document.getElementById('balance');
    const initialBalanceDisplay = document.getElementById('initial-balance');
    const expensesDisplay = document.getElementById('expenses');
    const balanceForm = document.getElementById('balance-form');
    const initialBalanceInput = document.getElementById('initial-balance-input');
    const expenseForm = document.getElementById('expense-form');
    const expenseNameInput = document.getElementById('expense-name');
    const expenseAmountInput = document.getElementById('expense-amount');
    const expenseCategoryInput = document.getElementById('expense-category');
    const transactionsList = document.getElementById('transactions-list');
    const clearHistoryBtn = document.getElementById('clear-history');

    //uporor code tu likhisu jate ami HTML ot ji data disu heikhini Javascript e access koribo pare

    loadData(); //ji khini data ase heitu load koribo 

    balanceForm.addEventListener('submit', handleBalanceSubmit);
    expenseForm.addEventListener('submit', handleExpenseSubmit);
    clearHistoryBtn.addEventListener('click', clearAllTransactions);

    updateUI(); // data tu load hua pasot tu UI change koibo lagibo heikarone updateUi() ei meethod tu use korisu

    function loadData() {
        const savedData = localStorage.getItem('expenseTrackerData');
        if (savedData) {
            const data = JSON.parse(savedData);
            initialBalance = data.initialBalance || 0;
            totalExpenses = data.totalExpenses || 0;   // yat je totalExpense or 0 buli disu tar karon hoise je jodi kiba data initially ase tetia thi ase nohole jodi amar javascript e 0 fetch kore HTML ot tetia hi 0 capture kori lobo
            transactions = data.transactions || [];
            balance = initialBalance - totalExpenses; // eitu buji e pabi basic math okol . remaining balance = remaining balance - total expenses
        }
    }

    function saveData() {
        const data = {
            initialBalance,
            totalExpenses,
            transactions
        };
        localStorage.setItem('expenseTrackerData', JSON.stringify(data)); // ami JSON.stringify use koru jetia amar locall storageor data browserot show korabo logia hoi.amar caseot ami ji balance fetch calculate korisu heitu data browserot share korim
    }

    function updateUI() {
        initialBalanceDisplay.textContent = `₹${initialBalance.toFixed(2)}`; // backtick symbol use koru jetia calculation koribo logia hoi single lineot
        expensesDisplay.textContent = `₹${totalExpenses.toFixed(2)}`;
        balance = initialBalance - totalExpenses;
        balanceDisplay.textContent = `₹${balance.toFixed(2)}`;

        balanceDisplay.classList.toggle('income', balance >= 0);
        balanceDisplay.classList.toggle('expense', balance < 0);

        renderTransactions(); //ei fuction tu browserot Balance, INitial balance , expense show koribo karone use koru
    }

    function handleBalanceSubmit(e) { // ei functiontu trigger hobo jetia user balance set koribo try koribo
        // eitu function tu handle koribo balance set koribo karone
        e.preventDefault();
        const amount = parseFloat(initialBalanceInput.value);// parseFloat use koru jate user input tu number formatot convert hoi

        if (isNaN(amount) || amount < 0) {// check koru jodi user input number formatot na hoi ne negative hoi
            alert('Please enter a valid amount');
            return;
        }

        initialBalance = amount;//ami initial balance tu user inputot set koru mane usere ji input  dibo heitu e set hobo
        balance = initialBalance - totalExpenses;

        transactions.unshift({// unshift use koru jate user input tu listor first positionot add hoi
            id: Date.now(),
            type: 'income',
            amount,
            name: 'Balance Added',
            category: 'balance',
            date: new Date().toLocaleString()
        });

        saveData();
        updateUI();
        balanceForm.reset();//ebar jetia submit korim tar pasot formor part tu reset hobo
    }

    function handleExpenseSubmit(e) {// ei function tu handle koribo user expense set koribo karone
        e.preventDefault();// preventDefault use koru jate form submit huar pasot page reload nohouk
        const name = expenseNameInput.value.trim();
        const amount = parseFloat(expenseAmountInput.value);// parseFloat use koru jate user input tu number formatot convert hoi
        const category = expenseCategoryInput.value;//

        if (!name || isNaN(amount) || amount <= 0 || !category) {//jodi name aru amount or fieldor bhitorot etau khali thake tetia alert message print koribo
            alert('Please fill all fields correctly');
            return;
        }

        totalExpenses += amount;
        balance = initialBalance - totalExpenses;

        transactions.unshift({
            id: Date.now(),
            type: 'expense',
            amount,
            name,
            category,
            date: new Date().toLocaleString()
        });

        saveData();
        updateUI();
        expenseForm.reset();
    }

    function renderTransactions() {// ei function tu transactions listor UI update koribo karone use koru
        if (transactions.length === 0) {
            transactionsList.innerHTML = '<p class="no-transactions">No recent transactions .</p>';//
            return;
        }

        transactionsList.innerHTML = '';
        transactions.forEach(transaction => {
            const div = document.createElement('div');
            div.className = `transaction ${transaction.type}`;
            div.innerHTML = `
                <div class="transaction-info">
                    <h3>${transaction.name}</h3>
                    <p>${transaction.date}</p>
                    <span>${formatCategory(transaction.category)}</span>
                </div>
                <p class="amount ${transaction.type === 'income' ? 'income' : 'expense'}">
                    ${transaction.type === 'income' ? '+' : '-'}₹${transaction.amount.toFixed(2)}
                </p>
            `;
            transactionsList.appendChild(div);
        });
    }

    function formatCategory(cat) {//ei function tu category name format koribo karone use koru cat tu mane category
        const categories = {
            transport: 'Transportation',
            entertainment: 'Entertainment',
            shopping: 'Shopping',
            education: 'Education',
            other: 'Other',
            balance: 'Balance'
        };
        return categories[cat] || cat;
    }

    function clearAllTransactions() {
        if (confirm('are you sure you want to clear all transactions?')) {
            initialBalance = 0;
            totalExpenses = 0;
            balance = 0;
            transactions = [];
            saveData();
            updateUI();
        }
    }
});
