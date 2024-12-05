def get_user_response(options):
    """Helper function to get user input with predefined options."""
    print("Choose your response:")
    for i, option in enumerate(options, 1):
        print(f"{i}. {option}")
    while True:
        try:
            choice = int(input("Your choice: "))
            if 1 <= choice <= len(options):
                return options[choice - 1]
            else:
                print("Invalid choice. Please select a valid option.")
        except ValueError:
            print("Invalid input. Please enter a number corresponding to your choice.")

def introduction():
    """Introduction to the donor."""
    print("Agent: Hi! Am I speaking with Mr/Ms_______? (Pause)")
    name = input("User (Your name): ").strip()
    print(f"Agent: Good Morning {name}. This is ____________ from Ketto.")
    print("Agent: How are you doing today?")
    response = get_user_response([
        "I'm good, how are you?",
        "I'm busy right now.",
        "Not doing well."
    ])
    if "how are you" in response.lower():
        print("Agent: I’m fine, thanks for asking!")
    elif "busy" in response.lower():
        print("Agent: I completely understand you must be busy right now, but I only need 2 mins of your time.")
    else:
        print("Agent: I’m sorry to hear that. I hope things get better soon.")

def donor_appreciation():
    """Thank the donor for previous donations."""
    print("Agent: Mr. Donor, firstly I would like to thank you for your previous donation that you have done and saved a life.")
    print("Agent: We really appreciate your support on our platform.")

def explain_sip():
    """Explain the Social Impact Plan (SIP)."""
    print("Agent: Today, we are running an emergency campaign to save the lives of underprivileged children.")
    print("Agent: This is the Medical and Education SIP, a monthly auto-debit plan.")
    print("Agent: Would you like to contribute a small donation of 200 to 300 rupees?")
    response = get_user_response(["Yes, I’d like to donate.", "No, I’m not interested.", "Tell me more."])
    if "yes" in response.lower():
        close_procedure()
    elif "no" in response.lower():
        handle_objection()
    else:
        print("Agent: The SIP offers 80G tax benefits and helps provide education and healthcare to underprivileged children.")
        close_procedure()

def close_procedure():
    """Close the donation process."""
    print("Agent: Great! Let’s close the procedure now.")
    print("Agent: As I can see, you made a donation in the past through UPI. Shall I send a request on your UPI app?")
    response = get_user_response(["Yes, send the request.", "No, use WhatsApp."])
    if "yes" in response.lower():
        print("Agent: I’ve sent the request to your UPI app. Please confirm it.")
    else:
        print("Agent: I’ll share a link on WhatsApp from where you can complete the process.")

def handle_objection():
    """Handle donor objections."""
    print("Agent: May I know if there is anything bothering you or stopping you from supporting this noble cause?")
    for attempt in range(3):
        response = input(f"User (Attempt {attempt + 1}/3): ").strip().lower()
        if "yes" in response:
            close_procedure()
            return
        elif "no" in response:
            continue
        else:
            print("Agent: Please consider this opportunity to help.")
    print("Agent: I understand. Thank you for your time.")

def post_enrollment():
    """Post-enrollment questions."""
    print("Agent: Before we end this call, may I ask a few questions to improve your donation experience?")
    print("Agent: Can I take your Date of Birth, Occupation, Education, preferred cause, frequency of donation, and PAN card details for 80G?")
    response = get_user_response(["Yes, sure.", "No, not right now."])
    if "yes" in response.lower():
        print("Agent: Thank you! Your details have been recorded.")
    else:
        print("Agent: No problem. Thank you for your time.")

def multicause_pitch():
    """Pitch additional causes."""
    print("Agent: As you enrolled in the medical campaign, we have other campaigns you may be interested in:")
    campaigns = [
        "Education: Support underprivileged kids for basic education.",
        "Food and Hunger: Provide mid-day meals to underprivileged kids.",
        "Animal Welfare: Support street animals with shelter and food.",
        "Elderly Support: Help old-age people with basic needs.",
        "Women Empowerment: Teach women livelihood skills."
    ]
    for campaign in campaigns:
        print(f"- {campaign}")
    response = get_user_response(["I’d like to support one of these.", "Not interested."])
    if "support" in response.lower():
        selected_campaign = get_user_response(campaigns)
        print(f"Agent: Thank you for supporting {selected_campaign}. We’ll share the details shortly.")
    else:
        print("Agent: No problem. Thank you for your time.")

def voice_bot():
    """Simulate the entire voice bot flow."""
    introduction()
    donor_appreciation()
    explain_sip()
    post_enrollment()
    multicause_pitch()
    print("Agent: Thank you so much for your support, Mr./Ms._______. Have a great day!")

if __name__ == "__main__":
    voice_bot()