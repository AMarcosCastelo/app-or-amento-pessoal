class Expense {

    constructor(year, month, day, type, description, cost) {
        this.year = year;
        this.month = month;
        this.day = day;
        this.type = type;
        this.description = description;
        this.cost = cost;
    };

    validateData() {
        for (let i in this) {

            if(this[i] == undefined || this[i] == '' || this[i] == null){
                return false;
            };

        };

        return true;
    };

};

class Bd {

    constructor() {

        let id = localStorage.getItem('id');

        if (id === null) {

            localStorage.setItem('id', 0);

        };

    };

    getNextId() {

        let nextId = localStorage.getItem('id');

        return parseInt(nextId) + 1;

    };

    record(d) {

        let id = this.getNextId();

        localStorage.setItem(id, JSON.stringify(d));

        localStorage.setItem('id', id);
    
    };

    retrieveRecords() {

        //Expense Array

        let expenses = Array();

        let id = localStorage.getItem('id');

        //Recover all registered expenses
        for (let i = 1; i <= id; i++) {

            let expense = JSON.parse(localStorage.getItem(i));

            //Check for the possibility of removed indexes
            //skip removed items

            if(expense === null) {

                continue;

            }

            expense.id = i;
            expenses.push(expense);
        };

        return expenses;

    };

    search(expense) {

        let filteredExpenses = Array();
        
        filteredExpenses = this.retrieveRecords();

        //Filters
        if (expense.year != '') {
            filteredExpenses = filteredExpenses.filter(d => d.year == expense.year);

        }

        if (expense.month != '') {
            filteredExpenses = filteredExpenses.filter(d => d.month == expense.month);

        }

        if (expense.day != '') {
            filteredExpenses = filteredExpenses.filter(d => d.day == expense.day);

        }

        if (expense.type != '') {
            filteredExpenses = filteredExpenses.filter(d => d.type == expense.type);

        }

        if (expense.description != '') {
            filteredExpenses = filteredExpenses.filter(d => d.description == expense.description);
        }

        if (expense.cost != '') {
            filteredExpenses = filteredExpenses.filter(d => d.cost == expense.cost);

        }

        return filteredExpenses;
    };

    remove(id) {
        localStorage.removeItem(id);
    }

};

let bd= new Bd();


function recordExpenses() {

    let year = document.getElementById('year');
    let month = document.getElementById('month');
    let day = document.getElementById('day');
    let type = document.getElementById('type');
    let description = document.getElementById('description');
    let cost = document.getElementById('cost');

    let expense = new Expense(
        year.value,
        month.value,
        day.value,
        type.value,
        description.value,
        cost.value
    );

    if (expense.validateData()) {
    
        bd.record(expense);
        document.getElementById('modal_title').innerHTML = 'Registro inserido com sucesso.';
        document.getElementById('modal_title_div').className = 'modal-header text-success';
        document.getElementById('messageBody').innerHTML = 'Despesa foi cadastrada com sucesso!';
        document.getElementById('modal_btn').innerHTML = 'Voltar';
        document.getElementById('modal_btn').className = 'btn btn-success';

        $('#recordExpense').modal('show');
        
        year.value = '';
        month.value = '';
        day.value = '';
        type.value = '';
        description.value = '';
        cost.value = '';


    } else {

        document.getElementById('modal_title').innerHTML = 'Erro na inclusão do registro.';
        document.getElementById('modal_title_div').className = 'modal-header text-danger';
        document.getElementById('messageBody').innerHTML = 'Erro na gravação do registro!';
        document.getElementById('modal_btn').innerHTML = 'Voltar e corrigir';
        document.getElementById('modal_btn').className = 'btn btn-danger';
        
        $('#recordExpense').modal('show');
        

    }


};

function loadListExpenses(expenses = Array(), filter = false) {

    if(expenses.length == 0 && filter == false) {
        expenses = bd.retrieveRecords();
    }

    let listExpenses = document.getElementById('listExpenses');
    listExpenses.innerHTML = '';

    //go through the expenses array, listing each expense dynamically
    expenses.forEach(function(d){
        
        //creating tr line
        let line = listExpenses.insertRow()

        //creating columns
        line.insertCell(0).innerHTML = `${d.day}/${d.month}/${d.year}`;

        //adjust type
        switch(d.type) {
            case '1': d.type = 'Alimentação'
                break;
            case '2': d.type = 'Educação'
                break;
            case '3': d.type = 'Lazer'
                break;
            case '4': d.type = 'Saúde'
                break;
            case '1': d.type = 'Transporte'
                break;
        }
        line.insertCell(1).innerHTML = d.type;
        line.insertCell(2).innerHTML = d.description;
        line.insertCell(3).innerHTML = d.cost;

        //Create the delete button 

        let btn = document.createElement('button');
        btn.className = 'btn btn-danger';
        btn.innerHTML = '<i class="fas fa-times"></i>';
        btn.id = `id_expense_${d.id}`;
        btn.onclick = function() {
            //remove expense
            let id = this.id.replace('id_expense_', '');
            bd.remove(id);
            window.location.reload();
        }
        line.insertCell(4).append(btn);

    });

};

function researchExpenses() {

    let year = document.getElementById('year').value;
    let month = document.getElementById('month').value;
    let day = document.getElementById('day').value;
    let type = document.getElementById('type').value;
    let description = document.getElementById('description').value;
    let cost = document.getElementById('cost').value;

    let expense = new Expense(year, month, day, type, description, cost);

    let expenses = bd.search(expense);

    loadListExpenses(expenses, true);

};