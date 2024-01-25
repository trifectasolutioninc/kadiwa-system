import React from 'react';

class TermsAndConditions extends React.Component {
    constructor() {
        super();
        this.state = {
            agreeChecked: false,
            privacyChecked: false,
        };
    }

    handleAgreeCheckboxChange = () => {
        this.setState((prevState) => ({
            agreeChecked: !prevState.agreeChecked,
        }));
    };

    handlePrivacyCheckboxChange = () => {
        this.setState((prevState) => ({
            privacyChecked: !prevState.privacyChecked,
        }));
    };

    checkAgreement = () => {
        const { agreeChecked, privacyChecked } = this.state;

        if (agreeChecked && privacyChecked) {
            // Redirect to another page (replace 'signup' with your desired route)
            window.location.href = '/signup';
        } else {
            alert('Please agree to both terms and conditions and the privacy policy.');
        }
    };

    render() {
        return (
            <div className="flex m-0 p-2 max-h-screen h-screen" style={{ background: 'linear-gradient(to bottom, #309340, #0D5B19)' }}>
                <div className="max-w-lg mx-auto p-4 overflow-auto">
                    <h2 className="text-2xl font-bold mb-6" style={{ color: '#FAFF00' }}>Kadiwa App - Terms and Conditions</h2>

                    <div className="mb-4">
                        <p className="text-white leading-tight">
                            Welcome to the Kadiwa App! These terms and conditions ("Terms") govern your use of the Kadiwa mobile application ("the App") provided by the Department of Agriculture. By downloading, installing, or using the App, you agree to be bound by these Terms. If you do not agree to these Terms, please do not use the App.
                        </p>
                    </div>

                    <div className="mb-4">
                        <h3 className="text-lg font-bold mb-2" style={{ color: '#FAFF00' }}>License</h3>
                        <p className="text-white leading-tight">
                            The Department of Agriculture grants you a limited, non-exclusive, non-transferable, revocable license to use the App for your personal, non-commercial purposes. You may not modify, reverse engineer, decompile, or disassemble the App, nor create derivative works based on the App.
                        </p>
                    </div>

                    <div className="mb-4">
                        <h3 className="text-lg font-bold mb-2" style={{ color: '#FAFF00' }}>User Responsibilities</h3>
                        <p className="text-white leading-tight">
                            You agree to use the App in compliance with all applicable laws and regulations. You are responsible for maintaining the confidentiality of your account and password and for restricting access to your device. You are also responsible for all activities that occur under your account or password.
                        </p>
                    </div>

                    <div className="mb-4">
                        <h3 className="text-lg font-bold mb-2" style={{ color: '#FAFF00' }}>Privacy Policy</h3>
                        <p className="text-white leading-tight">
                            Our Privacy Policy outlines how your data will be handled. Please read our <a href="#privacyPolicyLink" className="text-blue-500">Privacy Policy</a> for more information.
                        </p>
                    </div>

                    <div className="mb-6">
                        <input type="checkbox" id="agreeCheckbox" className="mr-2" checked={this.state.agreeChecked} onChange={this.handleAgreeCheckboxChange} />
                        <label htmlFor="agreeCheckbox" className="text-white">I agree to the terms and conditions</label>

                        <br />

                        <input type="checkbox" id="privacyCheckbox" className="mr-2" checked={this.state.privacyChecked} onChange={this.handlePrivacyCheckboxChange} />
                        <label htmlFor="privacyCheckbox" className="text-white">I agree to the <a href="#privacyPolicyLink" className="text-blue-500">Privacy Policy</a></label>
                    </div>

                    <div className="flex justify-end">
                        <button id="nextButton" className="bg-blue-500 text-white px-4 py-2 rounded" onClick={this.checkAgreement}>Next</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default TermsAndConditions;
