

// AI Generated React Component (3:14:00 AM): Create a stepper/wizard component with 3 steps...
function App() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    step1: '',
    step2: '',
    step3: '',
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleNextStep = () => {
    if (step < 3) {
      setStep(step + 1);
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleFinish = () => {
    console.log(formData);
  };

  return (
    <div style={{ padding: '20px', width: '500px', margin: '40px auto' }}>
      <h2 style={{ marginBottom: '20px' }}>Stepper Wizard</h2>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div
          style={{
            backgroundColor: step >= 1 ? 'lightblue' : 'lightgray',
            padding: '10px',
            border: '1px solid #ccc',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
          onClick={() => setStep(1)}
        >
          Step1        </div>
        <div
          style={{
            backgroundColor: step >= 2 ? 'lightblue' : 'lightgray',
            padding: '10px',
            border: '1px solid #ccc',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
          onClick={() => setStep(2)}
        >
          Step 2
        </div>
        <div
          style={{
            backgroundColor: step >= 3 ? 'lightblue' : 'lightgray',
            padding: '10px',
            border: '1px solid #ccc',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
          onClick={() => setStep(3)}
        >
          Step 3 </div>
      </div>
      {step === 1 && (
        <div style={{ marginTop: '20px' }}>
          <label style={{ display: 'block', marginBottom: '10px' }}>
            Step 1 Input:
          </label>
          <input
            type="text"
            name="step1"
            value={formData.step1}
            onChange={handleInputChange}
            style={{ padding: '10px', border: '1px solid #ccc' }}
          />
        </div>
      )}
      {step === 2 && (
        <div style={{ marginTop: '20px' }}>
          <label style={{ display: 'block', marginBottom: '10px' }}>
            Step 2 Input:
          </label>
          <input
            type="text"
            name="step2"
            value={formData.step2}
            onChange={handleInputChange}
            style={{ padding: '10px', border: '1px solid #ccc' }}
          />
        </div>
      )}
      {step === 3 && (
        <div style={{ marginTop: '20px' }}>
          <label style={{ display: 'block', marginBottom: '10px' }}>
            Step 3 Input:
          </label>
          <input
            type="text"
            name="step3"
            value={formData.step3}
            onChange={handleInputChange}
            style={{ padding: '10px', border: '1px solid #ccc' }}
          />
        </div>
      )}
      <div style={{ marginTop: '20px' }}>
        {step > 1 && (
          <button
            style={{
              padding: '10px',
              border: 'none',
              borderRadius: '5px',
              backgroundColor: 'lightblue',
              cursor: 'pointer',
            }}
            onClick={handlePrevStep}
          >
            Previous
          </button>
        )}
        {step < 3 && (
          <button
            style={{
              padding: '10px',
              border: 'none',
              borderRadius: '5px',
              backgroundColor: 'lightblue',
              cursor: 'pointer',
              marginLeft: '10px',
            }}
            onClick={handleNextStep}
          >
            Next
          </button>
        )}
        {step === 3 && (
          <button
            style={{
              padding: '10px',
              border: 'none',
              borderRadius: '5px',
              backgroundColor: 'lightblue',
              cursor: 'pointer',
              marginLeft: '10px',
            }}
            onClick={handleFinish}
          >
            Finish
          </button>
        )}
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));