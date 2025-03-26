package com.utcn.demo.service;

import com.mailersend.sdk.MailerSend;
import com.mailersend.sdk.emails.Email;
import com.mailersend.sdk.emails.Personalization;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class EmailService {
    @Value("${MAILERSEND_API_KEY}")
    private String mailerSendApiKey;

    @Value("${MAILERSEND_FROM_EMAIL}")
    private String fromEmail;

    private final MailerSend mailerSend;
    private static final String BAN_TEMPLATE_ID = "351ndgwojr54zqx8";

    public EmailService() {
        this.mailerSend = new MailerSend();
    }

    public void sendBanNotification(String userEmail, String userName) {
        try {
            mailerSend.setToken(mailerSendApiKey);

            Email email = new Email();
            email.setSubject("You have been banned from Stackoverflow");
            email.setTemplateId(BAN_TEMPLATE_ID);
            email.setFrom("Stackoverflow Team", fromEmail);
            email.addRecipient(userName, userEmail);

            email.addPersonalization("name", userName);
            email.addPersonalization("duration", "indefinite");
            email.addPersonalization("start_date", LocalDateTime.now().format(DateTimeFormatter.ofPattern("MMMM dd, yyyy")));
            email.addPersonalization("appealable", "false");

            mailerSend.emails().send(email);
        } catch (Exception e) {
            System.err.println("Failed to send ban notification email: " + e.getMessage());
            e.printStackTrace();
        }
    }

} 