function calculateComplexity() {
    const sizeWeight = 0.5;
    const complexityWeight = 1;
    const importComplexityWeight = 1;
    const trafficWeight = 3;
    const integrationWeight = 0.5;
    const customerWeight = 0.5;
    const urgencyWeight = 0.5;
    const teamWeight = 0.5;

    const size = parseInt(document.getElementById('size').value);
    const complexity = parseInt(document.getElementById('complexity').value);
    const importComplexity = parseInt(document.getElementById('import').value);
    const traffic = parseInt(document.getElementById('traffic').value);
    const integration = parseInt(document.getElementById('integration').value);
    const customer = parseInt(document.getElementById('customer').value);
    const urgency = parseInt(document.getElementById('urgency').value);
    const team = parseInt(document.getElementById('team').value);

    const total = size * sizeWeight +
                  complexity * complexityWeight +
                  importComplexity * importComplexityWeight +
                  traffic * trafficWeight +
                  integration * integrationWeight +
                  customer * customerWeight +
                  urgency * urgencyWeight +
                  team * teamWeight;

    let result;
    console.log(total/8);

    if (total <= 5) {
        result = 'XS';
    } else if (total <= 10) {
        result = 'S';
    } else if (total <= 20) {
        result = 'M';
    } else if (total <= 30) {
        result = 'L';
    } else {
        result = 'XL';
    }

    document.getElementById('result-bubble').innerText = `${result} (${total/8})`;
}

function clearFields() {
    document.querySelectorAll('select').forEach(select => {
        select.selectedIndex = 0;
    });

    document.getElementById('result-bubble').innerText = 'Power Score';
}
  
  
  export default function decorate(block) {
        const fields = [
          { id: 'size', label: 'Size in pages:', options: ['XS (< 100)', 'S (< 500)', 'M (< 5000)', 'L (< 50,000)', 'XL (> 50,000)'] },
          { id: 'complexity', label: 'Code Complexity:', options: ['XS (< 5)', 'S (< 10)', 'M (< 30)', 'L (< 100)', 'XL (> 100)'] },
          { id: 'import', label: 'Import Complexity:', options: ['XS', 'S', 'M', 'L', 'XL'] },
          { id: 'traffic', label: 'Traffic / Business Impact:', options: ['XS', 'S', 'M', 'L', 'XL'] },
          { id: 'integration', label: 'Integration Complexity:', options: ['XS', 'S', 'M', 'L', 'XL'] },
          { id: 'customer', label: 'Customer Complexity:', options: ['XS', 'S', 'M', 'L', 'XL'] },
          { id: 'urgency', label: 'Customer Urgency:', options: ['XS', 'S', 'M', 'L', 'XL'] },
          { id: 'team', label: 'Team Complexity:', options: ['XS', 'S', 'M', 'L', 'XL'] }
        ];
      
        const containerDiv = document.createElement('div');
        containerDiv.classList.add('container');
        block.appendChild(containerDiv);

        const resultBubble = document.createElement('div');
        resultBubble.setAttribute('id', 'result-bubble');
        resultBubble.textContent = 'Power Score';
        containerDiv.appendChild(resultBubble);

        const calculateButton = document.createElement('button');
        calculateButton.textContent = 'Calculate';
        calculateButton.addEventListener('click', calculateComplexity);

        const clearButton = document.createElement('button');
        clearButton.textContent = 'Clear';
        clearButton.addEventListener('click', clearFields);

        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('button-container');
        buttonContainer.append(calculateButton,clearButton );
        containerDiv.appendChild(buttonContainer);

        const formContainer = document.createElement('div');
        formContainer.classList.add('form-container');
        containerDiv.appendChild(formContainer);
      
        const calculatorDiv = document.createElement('div');
        calculatorDiv.classList.add('calculator');
        formContainer.appendChild(calculatorDiv);
      
        fields.forEach(field => {
          const formGroup = document.createElement('div');
          formGroup.classList.add('form-group');
          calculatorDiv.appendChild(formGroup);
      
          const label = document.createElement('label');
          label.setAttribute('for', field.id);
          label.textContent = field.label;
          formGroup.appendChild(label);
      
          const select = document.createElement('select');
          select.setAttribute('id', field.id);
          formGroup.appendChild(select);
      
          field.options.forEach((option, index) => {
            const optionElement = document.createElement('option');
            optionElement.setAttribute('value', index);
            optionElement.textContent = option;
            select.appendChild(optionElement);
          });
        });
      
        const scoreContainer = document.createElement('div');
        scoreContainer.classList.add('score-container');
        containerDiv.appendChild(scoreContainer);
      }