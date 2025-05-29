package com.utcn.demo.service;

import brevo.*;
import brevo.auth.ApiKeyAuth;
import brevoApi.AccountApi;
import brevoApi.EmailCampaignsApi;
import brevoModel.GetAccount;
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

    @Value("${BREVO_API_KEY}")
    private String brevoApiKey;
    private final MailerSend mailerSend;
    private static final String BAN_TEMPLATE_ID = "351ndgwojr54zqx8";

    public EmailService() {
        this.mailerSend = new MailerSend();
    }

    public void sendBanNotification(String userEmail, String userName) {
        ApiClient defaultClient = Configuration.getDefaultApiClient();

        // Configure API key authorization: api-key
        ApiKeyAuth apiKey = (ApiKeyAuth) defaultClient.getAuthentication("api-key");
        apiKey.setApiKey(brevoApiKey);
        // Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
        apiKey.setApiKeyPrefix("Token");

        EmailCampaignsApi apiInstance = new EmailCampaignsApi();
        Long campaignId = 789L; // Long | Id of the campaign
        try {
            apiInstance.sendEmailCampaignNow(campaignId);
        } catch (ApiException e) {
            System.err.println("Exception when calling EmailCampaignsApi#sendEmailCampaignNow");
            e.printStackTrace();
        }

    }

} 