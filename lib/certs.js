'use strict';

var certs = {
  dev: {
    ca: [
      "-----BEGIN CERTIFICATE-----\n" +
          "MIIDJjCCAg4CAlgOMA0GCSqGSIb3DQEBBQUAMH0xCzAJBgNVBAYTAlVTMQswCQYD\n" +
          "VQQIEwJDQTEWMBQGA1UEBxMNU2FuIEZyYW5jaXNjbzEZMBcGA1UEChMQU3Ryb25n\n" +
          "TG9vcCwgSW5jLjESMBAGA1UECxMJU3Ryb25nT3BzMRowGAYDVQQDExFjYS5zdHJv\n" +
          "bmdsb29wLmNvbTAeFw0xNDAxMjExMjUzMzhaFw00MTA2MDcxMjUzMzhaMBkxFzAV\n" +
          "BgNVBAMTDnN0cm9uZ2xvb3AuY29tMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIB\n" +
          "CgKCAQEAtYM3vtCB1BRlEnKTEroH1WXCO9IlXvddXm/1qttHXjlTilJ+FQY/epok\n" +
          "9Nqbjg0wX64H8Oyxrl0Xkig8oQZ4ItXB+0MYGh5Weww1OJwNJX+ulhCpOW2EwOVm\n" +
          "Jdtw4BLHFBLSzFjgpiMAk5C/RchSpZcyiTQ1OgOaZXG5pstmCsH87sbFL9LxJsqT\n" +
          "pwxDPEU2Vdp53akw9Uu/rL3iKigHI2RORZyUr5xXCt9nryKz3al7bC4iqLmUW6T1\n" +
          "gHXX6gdwAmuyVHUCgVuGWxgpiVD1+9Pw7gx+mRIV7MrI1wBIBbvItCpHgupTXeR2\n" +
          "ZUGWgayIiBYjxBH5Rdn0nxeBncBbqwIDAQABoxkwFzAVBgNVHREEDjAMhwQAAAAA\n" +
          "hwR/AAABMA0GCSqGSIb3DQEBBQUAA4IBAQBkeNCnQJxK+Tpx8CmnwFZXCcD/t7lM\n" +
          "/1kdeQvY5axfkLESj/AhGHjPdJR97t9Mcq5FkuG4fMZPtVKrxkhHhYnHfw3wUCGt\n" +
          "70jR+nOv22GKwBUVK0cGoLRIGCoxqOU7xTG6fGshLYBnFxSkAIMr87ULcFIdvT11\n" +
          "W53PoMklkiMCkqZnj7IIDQTGuI0EldiWdqNGAJ9s16uFJpu3hXtZPU9mCUWzk6Qm\n" +
          "r3U9VNZITPm0H89R3OmwSKWlKsRWAjZntb5fTNodBpHwEbFJN8x3GdKEuA0v4das\n" +
          "ZbvF6cITTAk4qWwNRAF3WyOHMQmux6Iqx0L2JGOLAFUGiS4rPSpFLC7x\n" +
          "-----END CERTIFICATE-----\n",

      "-----BEGIN CERTIFICATE-----\n" +
          "MIIDbzCCAlcCAknbMA0GCSqGSIb3DQEBBQUAMH0xCzAJBgNVBAYTAlVTMQswCQYD\n" +
          "VQQIEwJDQTEWMBQGA1UEBxMNU2FuIEZyYW5jaXNjbzEZMBcGA1UEChMQU3Ryb25n\n" +
          "TG9vcCwgSW5jLjESMBAGA1UECxMJU3Ryb25nT3BzMRowGAYDVQQDExFjYS5zdHJv\n" +
          "bmdsb29wLmNvbTAeFw0xNDAxMjExMjUzMzhaFw00MTA2MDcxMjUzMzhaMH0xCzAJ\n" +
          "BgNVBAYTAlVTMQswCQYDVQQIEwJDQTEWMBQGA1UEBxMNU2FuIEZyYW5jaXNjbzEZ\n" +
          "MBcGA1UEChMQU3Ryb25nTG9vcCwgSW5jLjESMBAGA1UECxMJU3Ryb25nT3BzMRow\n" +
          "GAYDVQQDExFjYS5zdHJvbmdsb29wLmNvbTCCASIwDQYJKoZIhvcNAQEBBQADggEP\n" +
          "ADCCAQoCggEBAKVoMeVGM+slyzNBNHs4QxB/nxS+9R7PrSGSuUs0mGFqMCg2XRb0\n" +
          "fu0Z4W4GTgEmjH4rxh1zPo/XaADuKFKecxTiL1voIjFCWYjJho5Ewo1xKuZzGffa\n" +
          "HJXWyjFRSaLauA5Ghjb9h63i2epjqbamiX3aqekAlXfGnCJ4LN2GnxlFc2auozBt\n" +
          "3mI+Bz2BTW/EinPd9u7LRPDv2Nd6Ca0auegJxsqV1U6wZ5X3SZ3N1xQ5GcM+H/UW\n" +
          "MGIPuujQ5uM02CtNfgA4tjGoq/vo7W0J5YB2X1u+BzhbdKkxnvWHrzqvBxodNLRj\n" +
          "fUZypEOXWVfKVeX9ToDqi3LV35Kc7lZDtQMCAwEAATANBgkqhkiG9w0BAQUFAAOC\n" +
          "AQEAClTkhwj6S8/aDgnt3e1h0ciIEAxC15JZq4Tq+4oEWR5zT1fXxX84UBpOWy04\n" +
          "wuwuuNdGPIJfBQKa/IIVswOZS/8Rg9x1lE7BdJolK74+HHikk5UcvVULQLq6BYnm\n" +
          "UIP7huEGcyPpX382g5xjRCuqIOIjBZEGBxayUqKCI7FIhxoANdaQi+iyH0H38E9J\n" +
          "9TIboSB6mAElgs8FCIO+hLdLoy/60Ry3KDZ2ZLM72UrlCFEhzT0mG3VG2NdlHLBT\n" +
          "asy8JIILDOzwYfen0muzGMIkQNo2eU45hjwaL9yayjeQeSQufJsgZm3pzvN/yJPv\n" +
          "PJufwg30rXOt48FrCsqdVIwJNg==\n" + "-----END CERTIFICATE-----\n"
    ],
  },

  test: {
    ca: [
      "-----BEGIN CERTIFICATE-----\n" +
          "MIICITCCAYoCAjq+MA0GCSqGSIb3DQEBBQUAMH0xCzAJBgNVBAYTAlVTMQswCQYD\n" +
          "VQQIEwJDQTEWMBQGA1UEBxMNU2FuIEZyYW5jaXNjbzEZMBcGA1UEChMQU3Ryb25n\n" +
          "TG9vcCwgSW5jLjESMBAGA1UECxMJU3Ryb25nT3BzMRowGAYDVQQDExFjYS5zdHJv\n" +
          "bmdsb29wLmNvbTAeFw0xNDAxMjgxNjEyMzJaFw00MTA2MTQxNjEyMzJaMBkxFzAV\n" +
          "BgNVBAMTDnN0cm9uZ2xvb3AuY29tMIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKB\n" +
          "gQC2I1sYAec8tgY1o7XjEOm3+tE7dr2s68EthaAyKFvjuipCXgQRi6T6h1tZXtt/\n" +
          "/pz8Fx7LKcJTzVcpkUPFQkC1qBk0BHMWfhLK3tQ2nHQsFYwloKsW/495mrp8hzKp\n" +
          "F0PrqvfS+0HtyzC1Tpa9HQosqqtzmmI3txFktbVx5tNtGwIDAQABoxkwFzAVBgNV\n" +
          "HREEDjAMhwQAAAAAhwR/AAABMA0GCSqGSIb3DQEBBQUAA4GBAH7vPVqz7yRUZ1RI\n" +
          "qF8J+zbhWoqFGrwW7lpJrpxOOoqc7C/I/y4iB61aVHD3O7lkHTsUOl8ay6pvkPWb\n" +
          "LX3Usbr7sVsvbEL+zXNLDKpNGPJjkbXF2NqD31eRdnbNQ9fMKXNmtqx5vkdT0pSw\n" +
          "x9YXqepTOPeUbxPrde2AIQV6t3Ol\n" + "-----END CERTIFICATE-----\n",

      "-----BEGIN CERTIFICATE-----\n" +
          "MIICajCCAdMCAiyLMA0GCSqGSIb3DQEBBQUAMH0xCzAJBgNVBAYTAlVTMQswCQYD\n" +
          "VQQIEwJDQTEWMBQGA1UEBxMNU2FuIEZyYW5jaXNjbzEZMBcGA1UEChMQU3Ryb25n\n" +
          "TG9vcCwgSW5jLjESMBAGA1UECxMJU3Ryb25nT3BzMRowGAYDVQQDExFjYS5zdHJv\n" +
          "bmdsb29wLmNvbTAeFw0xNDAxMjgxNjEyMzJaFw00MTA2MTQxNjEyMzJaMH0xCzAJ\n" +
          "BgNVBAYTAlVTMQswCQYDVQQIEwJDQTEWMBQGA1UEBxMNU2FuIEZyYW5jaXNjbzEZ\n" +
          "MBcGA1UEChMQU3Ryb25nTG9vcCwgSW5jLjESMBAGA1UECxMJU3Ryb25nT3BzMRow\n" +
          "GAYDVQQDExFjYS5zdHJvbmdsb29wLmNvbTCBnzANBgkqhkiG9w0BAQEFAAOBjQAw\n" +
          "gYkCgYEAssmIcY4SJRy+jbOCmo//N4q+RqNXECHjxxvw9jzU8vMFdBzzN7AE6l1A\n" +
          "/hlqwPTFBTs4Am76kvIqyM52M2HU66O0RMpj4AEDND2Hy9TOGHJUch1oQWLZgHWk\n" +
          "2pg2cUyNfi+zJylDkPn+wS8vJ94RUXj7t8k7dze59JCpLzSU0gMCAwEAATANBgkq\n" +
          "hkiG9w0BAQUFAAOBgQBJCD65MOgAFdRbXm6+KaHDRpj7Fs4m8GpwF8QL+9533am0\n" +
          "TTRwQ/8anmmLLZqVghGVHBNc4uyLkKi7JMk1t+HBU3YhBeS9T1VqUNW8tsirVMnm\n" +
          "p7MePj8iQ3owDHHb5zXjqXsEEzqIbIDIw1usbPA/HNQeC3oUowSkaMEhSRlFYg==\n" +
          "-----END CERTIFICATE-----\n"
    ],
  },

  staging: {
    ca: [
      "-----BEGIN CERTIFICATE-----\n" +
          "MIIFdTCCBF2gAwIBAgIHB8NOt14L+DANBgkqhkiG9w0BAQUFADCB3DELMAkGA1UE\n" +
          "BhMCVVMxEDAOBgNVBAgTB0FyaXpvbmExEzARBgNVBAcTClNjb3R0c2RhbGUxJTAj\n" +
          "BgNVBAoTHFN0YXJmaWVsZCBUZWNobm9sb2dpZXMsIEluYy4xOTA3BgNVBAsTMGh0\n" +
          "dHA6Ly9jZXJ0aWZpY2F0ZXMuc3RhcmZpZWxkdGVjaC5jb20vcmVwb3NpdG9yeTEx\n" +
          "MC8GA1UEAxMoU3RhcmZpZWxkIFNlY3VyZSBDZXJ0aWZpY2F0aW9uIEF1dGhvcml0\n" +
          "eTERMA8GA1UEBRMIMTA2ODg0MzUwHhcNMTMwOTEwMjIwMTU2WhcNMTgwOTEwMjIw\n" +
          "MTU2WjA+MSEwHwYDVQQLExhEb21haW4gQ29udHJvbCBWYWxpZGF0ZWQxGTAXBgNV\n" +
          "BAMMECouc3Ryb25nbG9vcC5jb20wggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEK\n" +
          "AoIBAQDb41GHMpk50YBfu/4yjGZxY0s85KaObHCefHP1i4i5o3PcpjIexMAXiW+H\n" +
          "3eyBeaZUxl1BaDFZMKuZzZPQaeW6AQYJKBDPTpVGdoIdxqisXuPF+7Ow46cgHy7Z\n" +
          "6d2pdL2Dz++4vWi6Sb4c1j7mZZdvVP5uGe4pqsE2P/7eU4KKmMt0cg8Bl27VdLL5\n" +
          "M24SPz3r2yzvhCvZ/ktjNs5yYa2/Dz5WV/lpwm+K0XWcWtMdNfROQ/EildelN/hc\n" +
          "02KD3kjCd6c806R2l2b14SNqiFC3LCp/ku3KZ2PPJau8vQ313a/Q1v+mxTcLm5sF\n" +
          "rFN+ihU0AHtIe2rxn5Mh6K/npUR7AgMBAAGjggHXMIIB0zAPBgNVHRMBAf8EBTAD\n" +
          "AQEAMB0GA1UdJQQWMBQGCCsGAQUFBwMBBggrBgEFBQcDAjAOBgNVHQ8BAf8EBAMC\n" +
          "BaAwOQYDVR0fBDIwMDAuoCygKoYoaHR0cDovL2NybC5zdGFyZmllbGR0ZWNoLmNv\n" +
          "bS9zZnMxLTI2LmNybDBZBgNVHSAEUjBQME4GC2CGSAGG/W4BBxcBMD8wPQYIKwYB\n" +
          "BQUHAgEWMWh0dHA6Ly9jZXJ0aWZpY2F0ZXMuc3RhcmZpZWxkdGVjaC5jb20vcmVw\n" +
          "b3NpdG9yeS8wgY0GCCsGAQUFBwEBBIGAMH4wKgYIKwYBBQUHMAGGHmh0dHA6Ly9v\n" +
          "Y3NwLnN0YXJmaWVsZHRlY2guY29tLzBQBggrBgEFBQcwAoZEaHR0cDovL2NlcnRp\n" +
          "ZmljYXRlcy5zdGFyZmllbGR0ZWNoLmNvbS9yZXBvc2l0b3J5L3NmX2ludGVybWVk\n" +
          "aWF0ZS5jcnQwHwYDVR0jBBgwFoAUSUtSJ9EbvPKhIWpie1FCeorX1VYwKwYDVR0R\n" +
          "BCQwIoIQKi5zdHJvbmdsb29wLmNvbYIOc3Ryb25nbG9vcC5jb20wHQYDVR0OBBYE\n" +
          "FF9Ho15Cx/oU9t+aAb756gZYtXKnMA0GCSqGSIb3DQEBBQUAA4IBAQCkYxz9FfPW\n" +
          "iICBWWMndp30KYN4mdCurgYtTZaldUOgU7oOQlqyTgPPGgx3rod4292xyA/DPQi7\n" +
          "Ae2Yw66BzGhXPfpWniBSpUgYi8fxTWFXn2+E65TH3zBxfewappg8OUfQkhFC+yNd\n" +
          "Cim/G3pRutzkUjv4n5xp5ionzoSmwBTO/Z5UfCR16bbF94Lx0wPW1uKWrdHOML+O\n" +
          "A6LpqdCbXgOAytY6zq5Iwm5lbtO67Sm3qkUBcm+JMHV8pfh0pv2jvgDT3pBNSr7T\n" +
          "+Un/HRzCHlPZhpxoBNsT3bl4LQaQB2z6i5VTilhjkYnObZo3aRmIG5FRrHjNt0xF\n" +
          "EStBBHomtv5d\n" + "-----END CERTIFICATE-----\n",

      "-----BEGIN CERTIFICATE-----\n" +
          "MIIFBzCCA++gAwIBAgICAgEwDQYJKoZIhvcNAQEFBQAwaDELMAkGA1UEBhMCVVMx\n" +
          "JTAjBgNVBAoTHFN0YXJmaWVsZCBUZWNobm9sb2dpZXMsIEluYy4xMjAwBgNVBAsT\n" +
          "KVN0YXJmaWVsZCBDbGFzcyAyIENlcnRpZmljYXRpb24gQXV0aG9yaXR5MB4XDTA2\n" +
          "MTExNjAxMTU0MFoXDTI2MTExNjAxMTU0MFowgdwxCzAJBgNVBAYTAlVTMRAwDgYD\n" +
          "VQQIEwdBcml6b25hMRMwEQYDVQQHEwpTY290dHNkYWxlMSUwIwYDVQQKExxTdGFy\n" +
          "ZmllbGQgVGVjaG5vbG9naWVzLCBJbmMuMTkwNwYDVQQLEzBodHRwOi8vY2VydGlm\n" +
          "aWNhdGVzLnN0YXJmaWVsZHRlY2guY29tL3JlcG9zaXRvcnkxMTAvBgNVBAMTKFN0\n" +
          "YXJmaWVsZCBTZWN1cmUgQ2VydGlmaWNhdGlvbiBBdXRob3JpdHkxETAPBgNVBAUT\n" +
          "CDEwNjg4NDM1MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA4qddo+1m\n" +
          "72ovKzYf3Y3TBQKgyg9eGa44cs8W2lRKy0gK9KFzEWWFQ8lbFwyaK74PmFF6YCkN\n" +
          "bN7i6OUVTVb/kNGnpgQ/YAdKym+lEOez+FyxvCsq3AF59R019Xoog/KTc4KJrGBt\n" +
          "y8JIwh3UBkQXPKwBR6s+cIQJC7ggCEAgh6FjGso+g9I3s5iNMj83v6G3W1/eXDOS\n" +
          "zz4HzrlIS+LwVVAv+HBCidGTlopj2WYN5lhuuW2QvcrchGbyOY5bplhVc8tibBvX\n" +
          "IBY7LFn1y8hWMkpQJ7pV06gBy3KpdIsMrTrlFbYq32X43or174Q7+edUZQuAvUdF\n" +
          "pfBE2FM7voDxLwIDAQABo4IBRDCCAUAwHQYDVR0OBBYEFElLUifRG7zyoSFqYntR\n" +
          "QnqK19VWMB8GA1UdIwQYMBaAFL9ft9HO3R+G9FtVrNzXEMIOqYjnMBIGA1UdEwEB\n" +
          "/wQIMAYBAf8CAQAwOQYIKwYBBQUHAQEELTArMCkGCCsGAQUFBzABhh1odHRwOi8v\n" +
          "b2NzcC5zdGFyZmllbGR0ZWNoLmNvbTBMBgNVHR8ERTBDMEGgP6A9hjtodHRwOi8v\n" +
          "Y2VydGlmaWNhdGVzLnN0YXJmaWVsZHRlY2guY29tL3JlcG9zaXRvcnkvc2Zyb290\n" +
          "LmNybDBRBgNVHSAESjBIMEYGBFUdIAAwPjA8BggrBgEFBQcCARYwaHR0cDovL2Nl\n" +
          "cnRpZmljYXRlcy5zdGFyZmllbGR0ZWNoLmNvbS9yZXBvc2l0b3J5MA4GA1UdDwEB\n" +
          "/wQEAwIBBjANBgkqhkiG9w0BAQUFAAOCAQEAhlK6sx+mXmuQpmQq/EWyrp8+s2Kv\n" +
          "2x9nxL3KoS/HnA0hV9D4NiHOOiU+eHaz2d283vtshF8Mow0S6xE7cV+AHvEfbQ5f\n" +
          "wezUpfdlux9MlQETsmqcC+sfnbHn7RkNvIV88xe9WWOupxoFzUfjLZZiUTIKCGhL\n" +
          "Indf90XcYd70yysiKUQl0p8Ld3qhJnxK1w/C0Ty6DqeVmlsFChD5VV/Bl4t0zF4o\n" +
          "aRN+0AqNnQ9gVHrEjBs1D3R6cLKCzx214orbKsayUWm/EheSYBeqPVsJ+IdlHaek\n" +
          "KOUiAgOCRJo0Y577KM/ozS4OUiDtSss4fJ2ubnnXlSyokfOGASGRS7VApA==\n" +
          "-----END CERTIFICATE-----\n",

      "-----BEGIN CERTIFICATE-----\n" +
          "MIIEDzCCAvegAwIBAgIBADANBgkqhkiG9w0BAQUFADBoMQswCQYDVQQGEwJVUzEl\n" +
          "MCMGA1UEChMcU3RhcmZpZWxkIFRlY2hub2xvZ2llcywgSW5jLjEyMDAGA1UECxMp\n" +
          "U3RhcmZpZWxkIENsYXNzIDIgQ2VydGlmaWNhdGlvbiBBdXRob3JpdHkwHhcNMDQw\n" +
          "NjI5MTczOTE2WhcNMzQwNjI5MTczOTE2WjBoMQswCQYDVQQGEwJVUzElMCMGA1UE\n" +
          "ChMcU3RhcmZpZWxkIFRlY2hub2xvZ2llcywgSW5jLjEyMDAGA1UECxMpU3RhcmZp\n" +
          "ZWxkIENsYXNzIDIgQ2VydGlmaWNhdGlvbiBBdXRob3JpdHkwggEgMA0GCSqGSIb3\n" +
          "DQEBAQUAA4IBDQAwggEIAoIBAQC3Msj+6XGmBIWtDBFk385N78gDGIc/oav7PKaf\n" +
          "8MOh2tTYbitTkPskpD6E8J7oX+zlJ0T1KKY/e97gKvDIr1MvnsoFAZMej2YcOadN\n" +
          "+lq2cwQlZut3f+dZxkqZJRRU6ybH838Z1TBwj6+wRir/resp7defqgSHo9T5iaU0\n" +
          "X9tDkYI22WY8sbi5gv2cOj4QyDvvBmVmepsZGD3/cVE8MC5fvj13c7JdBmzDI1aa\n" +
          "K4UmkhynArPkPw2vCHmCuDY96pzTNbO8acr1zJ3o/WSNF4Azbl5KXZnJHoe0nRrA\n" +
          "1W4TNSNe35tfPe/W93bC6j67eA0cQmdrBNj41tpvi/JEoAGrAgEDo4HFMIHCMB0G\n" +
          "A1UdDgQWBBS/X7fRzt0fhvRbVazc1xDCDqmI5zCBkgYDVR0jBIGKMIGHgBS/X7fR\n" +
          "zt0fhvRbVazc1xDCDqmI56FspGowaDELMAkGA1UEBhMCVVMxJTAjBgNVBAoTHFN0\n" +
          "YXJmaWVsZCBUZWNobm9sb2dpZXMsIEluYy4xMjAwBgNVBAsTKVN0YXJmaWVsZCBD\n" +
          "bGFzcyAyIENlcnRpZmljYXRpb24gQXV0aG9yaXR5ggEAMAwGA1UdEwQFMAMBAf8w\n" +
          "DQYJKoZIhvcNAQEFBQADggEBAAWdP4id0ckaVaGsafPzWdqbAYcaT1epoXkJKtv3\n" +
          "L7IezMdeatiDh6GX70k1PncGQVhiv45YuApnP+yz3SFmH8lU+nLMPUxA2IGvd56D\n" +
          "eruix/U0F47ZEUD0/CwqTRV/p2JdLiXTAAsgGh1o+Re49L2L7ShZ3U0WixeDyLJl\n" +
          "xy16paq8U4Zt3VekyvggQQto8PT7dL5WXXp59fkdheMtlb71cZBDzI0fmgAKhynp\n" +
          "VSJYACPq4xJDKVtHCN2MQWplBqjlIapBtJUhlbl90TSrE9atvNziPTnNvT51cKEY\n" +
          "WQPJIrSPnNVeKtelttQKbfi3QBFGmh95DmK/D5fs4C8fF5Q=\n" +
          "-----END CERTIFICATE-----\n"
    ],
  },

  prod: {
    ca: [
      "-----BEGIN CERTIFICATE-----\n" +
          "MIIFdTCCBF2gAwIBAgIHB8NOt14L+DANBgkqhkiG9w0BAQUFADCB3DELMAkGA1UE\n" +
          "BhMCVVMxEDAOBgNVBAgTB0FyaXpvbmExEzARBgNVBAcTClNjb3R0c2RhbGUxJTAj\n" +
          "BgNVBAoTHFN0YXJmaWVsZCBUZWNobm9sb2dpZXMsIEluYy4xOTA3BgNVBAsTMGh0\n" +
          "dHA6Ly9jZXJ0aWZpY2F0ZXMuc3RhcmZpZWxkdGVjaC5jb20vcmVwb3NpdG9yeTEx\n" +
          "MC8GA1UEAxMoU3RhcmZpZWxkIFNlY3VyZSBDZXJ0aWZpY2F0aW9uIEF1dGhvcml0\n" +
          "eTERMA8GA1UEBRMIMTA2ODg0MzUwHhcNMTMwOTEwMjIwMTU2WhcNMTgwOTEwMjIw\n" +
          "MTU2WjA+MSEwHwYDVQQLExhEb21haW4gQ29udHJvbCBWYWxpZGF0ZWQxGTAXBgNV\n" +
          "BAMMECouc3Ryb25nbG9vcC5jb20wggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEK\n" +
          "AoIBAQDb41GHMpk50YBfu/4yjGZxY0s85KaObHCefHP1i4i5o3PcpjIexMAXiW+H\n" +
          "3eyBeaZUxl1BaDFZMKuZzZPQaeW6AQYJKBDPTpVGdoIdxqisXuPF+7Ow46cgHy7Z\n" +
          "6d2pdL2Dz++4vWi6Sb4c1j7mZZdvVP5uGe4pqsE2P/7eU4KKmMt0cg8Bl27VdLL5\n" +
          "M24SPz3r2yzvhCvZ/ktjNs5yYa2/Dz5WV/lpwm+K0XWcWtMdNfROQ/EildelN/hc\n" +
          "02KD3kjCd6c806R2l2b14SNqiFC3LCp/ku3KZ2PPJau8vQ313a/Q1v+mxTcLm5sF\n" +
          "rFN+ihU0AHtIe2rxn5Mh6K/npUR7AgMBAAGjggHXMIIB0zAPBgNVHRMBAf8EBTAD\n" +
          "AQEAMB0GA1UdJQQWMBQGCCsGAQUFBwMBBggrBgEFBQcDAjAOBgNVHQ8BAf8EBAMC\n" +
          "BaAwOQYDVR0fBDIwMDAuoCygKoYoaHR0cDovL2NybC5zdGFyZmllbGR0ZWNoLmNv\n" +
          "bS9zZnMxLTI2LmNybDBZBgNVHSAEUjBQME4GC2CGSAGG/W4BBxcBMD8wPQYIKwYB\n" +
          "BQUHAgEWMWh0dHA6Ly9jZXJ0aWZpY2F0ZXMuc3RhcmZpZWxkdGVjaC5jb20vcmVw\n" +
          "b3NpdG9yeS8wgY0GCCsGAQUFBwEBBIGAMH4wKgYIKwYBBQUHMAGGHmh0dHA6Ly9v\n" +
          "Y3NwLnN0YXJmaWVsZHRlY2guY29tLzBQBggrBgEFBQcwAoZEaHR0cDovL2NlcnRp\n" +
          "ZmljYXRlcy5zdGFyZmllbGR0ZWNoLmNvbS9yZXBvc2l0b3J5L3NmX2ludGVybWVk\n" +
          "aWF0ZS5jcnQwHwYDVR0jBBgwFoAUSUtSJ9EbvPKhIWpie1FCeorX1VYwKwYDVR0R\n" +
          "BCQwIoIQKi5zdHJvbmdsb29wLmNvbYIOc3Ryb25nbG9vcC5jb20wHQYDVR0OBBYE\n" +
          "FF9Ho15Cx/oU9t+aAb756gZYtXKnMA0GCSqGSIb3DQEBBQUAA4IBAQCkYxz9FfPW\n" +
          "iICBWWMndp30KYN4mdCurgYtTZaldUOgU7oOQlqyTgPPGgx3rod4292xyA/DPQi7\n" +
          "Ae2Yw66BzGhXPfpWniBSpUgYi8fxTWFXn2+E65TH3zBxfewappg8OUfQkhFC+yNd\n" +
          "Cim/G3pRutzkUjv4n5xp5ionzoSmwBTO/Z5UfCR16bbF94Lx0wPW1uKWrdHOML+O\n" +
          "A6LpqdCbXgOAytY6zq5Iwm5lbtO67Sm3qkUBcm+JMHV8pfh0pv2jvgDT3pBNSr7T\n" +
          "+Un/HRzCHlPZhpxoBNsT3bl4LQaQB2z6i5VTilhjkYnObZo3aRmIG5FRrHjNt0xF\n" +
          "EStBBHomtv5d\n" + "-----END CERTIFICATE-----\n",

      "-----BEGIN CERTIFICATE-----\n" +
          "MIIFBzCCA++gAwIBAgICAgEwDQYJKoZIhvcNAQEFBQAwaDELMAkGA1UEBhMCVVMx\n" +
          "JTAjBgNVBAoTHFN0YXJmaWVsZCBUZWNobm9sb2dpZXMsIEluYy4xMjAwBgNVBAsT\n" +
          "KVN0YXJmaWVsZCBDbGFzcyAyIENlcnRpZmljYXRpb24gQXV0aG9yaXR5MB4XDTA2\n" +
          "MTExNjAxMTU0MFoXDTI2MTExNjAxMTU0MFowgdwxCzAJBgNVBAYTAlVTMRAwDgYD\n" +
          "VQQIEwdBcml6b25hMRMwEQYDVQQHEwpTY290dHNkYWxlMSUwIwYDVQQKExxTdGFy\n" +
          "ZmllbGQgVGVjaG5vbG9naWVzLCBJbmMuMTkwNwYDVQQLEzBodHRwOi8vY2VydGlm\n" +
          "aWNhdGVzLnN0YXJmaWVsZHRlY2guY29tL3JlcG9zaXRvcnkxMTAvBgNVBAMTKFN0\n" +
          "YXJmaWVsZCBTZWN1cmUgQ2VydGlmaWNhdGlvbiBBdXRob3JpdHkxETAPBgNVBAUT\n" +
          "CDEwNjg4NDM1MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA4qddo+1m\n" +
          "72ovKzYf3Y3TBQKgyg9eGa44cs8W2lRKy0gK9KFzEWWFQ8lbFwyaK74PmFF6YCkN\n" +
          "bN7i6OUVTVb/kNGnpgQ/YAdKym+lEOez+FyxvCsq3AF59R019Xoog/KTc4KJrGBt\n" +
          "y8JIwh3UBkQXPKwBR6s+cIQJC7ggCEAgh6FjGso+g9I3s5iNMj83v6G3W1/eXDOS\n" +
          "zz4HzrlIS+LwVVAv+HBCidGTlopj2WYN5lhuuW2QvcrchGbyOY5bplhVc8tibBvX\n" +
          "IBY7LFn1y8hWMkpQJ7pV06gBy3KpdIsMrTrlFbYq32X43or174Q7+edUZQuAvUdF\n" +
          "pfBE2FM7voDxLwIDAQABo4IBRDCCAUAwHQYDVR0OBBYEFElLUifRG7zyoSFqYntR\n" +
          "QnqK19VWMB8GA1UdIwQYMBaAFL9ft9HO3R+G9FtVrNzXEMIOqYjnMBIGA1UdEwEB\n" +
          "/wQIMAYBAf8CAQAwOQYIKwYBBQUHAQEELTArMCkGCCsGAQUFBzABhh1odHRwOi8v\n" +
          "b2NzcC5zdGFyZmllbGR0ZWNoLmNvbTBMBgNVHR8ERTBDMEGgP6A9hjtodHRwOi8v\n" +
          "Y2VydGlmaWNhdGVzLnN0YXJmaWVsZHRlY2guY29tL3JlcG9zaXRvcnkvc2Zyb290\n" +
          "LmNybDBRBgNVHSAESjBIMEYGBFUdIAAwPjA8BggrBgEFBQcCARYwaHR0cDovL2Nl\n" +
          "cnRpZmljYXRlcy5zdGFyZmllbGR0ZWNoLmNvbS9yZXBvc2l0b3J5MA4GA1UdDwEB\n" +
          "/wQEAwIBBjANBgkqhkiG9w0BAQUFAAOCAQEAhlK6sx+mXmuQpmQq/EWyrp8+s2Kv\n" +
          "2x9nxL3KoS/HnA0hV9D4NiHOOiU+eHaz2d283vtshF8Mow0S6xE7cV+AHvEfbQ5f\n" +
          "wezUpfdlux9MlQETsmqcC+sfnbHn7RkNvIV88xe9WWOupxoFzUfjLZZiUTIKCGhL\n" +
          "Indf90XcYd70yysiKUQl0p8Ld3qhJnxK1w/C0Ty6DqeVmlsFChD5VV/Bl4t0zF4o\n" +
          "aRN+0AqNnQ9gVHrEjBs1D3R6cLKCzx214orbKsayUWm/EheSYBeqPVsJ+IdlHaek\n" +
          "KOUiAgOCRJo0Y577KM/ozS4OUiDtSss4fJ2ubnnXlSyokfOGASGRS7VApA==\n" +
          "-----END CERTIFICATE-----\n",

      "-----BEGIN CERTIFICATE-----\n" +
          "MIIEDzCCAvegAwIBAgIBADANBgkqhkiG9w0BAQUFADBoMQswCQYDVQQGEwJVUzEl\n" +
          "MCMGA1UEChMcU3RhcmZpZWxkIFRlY2hub2xvZ2llcywgSW5jLjEyMDAGA1UECxMp\n" +
          "U3RhcmZpZWxkIENsYXNzIDIgQ2VydGlmaWNhdGlvbiBBdXRob3JpdHkwHhcNMDQw\n" +
          "NjI5MTczOTE2WhcNMzQwNjI5MTczOTE2WjBoMQswCQYDVQQGEwJVUzElMCMGA1UE\n" +
          "ChMcU3RhcmZpZWxkIFRlY2hub2xvZ2llcywgSW5jLjEyMDAGA1UECxMpU3RhcmZp\n" +
          "ZWxkIENsYXNzIDIgQ2VydGlmaWNhdGlvbiBBdXRob3JpdHkwggEgMA0GCSqGSIb3\n" +
          "DQEBAQUAA4IBDQAwggEIAoIBAQC3Msj+6XGmBIWtDBFk385N78gDGIc/oav7PKaf\n" +
          "8MOh2tTYbitTkPskpD6E8J7oX+zlJ0T1KKY/e97gKvDIr1MvnsoFAZMej2YcOadN\n" +
          "+lq2cwQlZut3f+dZxkqZJRRU6ybH838Z1TBwj6+wRir/resp7defqgSHo9T5iaU0\n" +
          "X9tDkYI22WY8sbi5gv2cOj4QyDvvBmVmepsZGD3/cVE8MC5fvj13c7JdBmzDI1aa\n" +
          "K4UmkhynArPkPw2vCHmCuDY96pzTNbO8acr1zJ3o/WSNF4Azbl5KXZnJHoe0nRrA\n" +
          "1W4TNSNe35tfPe/W93bC6j67eA0cQmdrBNj41tpvi/JEoAGrAgEDo4HFMIHCMB0G\n" +
          "A1UdDgQWBBS/X7fRzt0fhvRbVazc1xDCDqmI5zCBkgYDVR0jBIGKMIGHgBS/X7fR\n" +
          "zt0fhvRbVazc1xDCDqmI56FspGowaDELMAkGA1UEBhMCVVMxJTAjBgNVBAoTHFN0\n" +
          "YXJmaWVsZCBUZWNobm9sb2dpZXMsIEluYy4xMjAwBgNVBAsTKVN0YXJmaWVsZCBD\n" +
          "bGFzcyAyIENlcnRpZmljYXRpb24gQXV0aG9yaXR5ggEAMAwGA1UdEwQFMAMBAf8w\n" +
          "DQYJKoZIhvcNAQEFBQADggEBAAWdP4id0ckaVaGsafPzWdqbAYcaT1epoXkJKtv3\n" +
          "L7IezMdeatiDh6GX70k1PncGQVhiv45YuApnP+yz3SFmH8lU+nLMPUxA2IGvd56D\n" +
          "eruix/U0F47ZEUD0/CwqTRV/p2JdLiXTAAsgGh1o+Re49L2L7ShZ3U0WixeDyLJl\n" +
          "xy16paq8U4Zt3VekyvggQQto8PT7dL5WXXp59fkdheMtlb71cZBDzI0fmgAKhynp\n" +
          "VSJYACPq4xJDKVtHCN2MQWplBqjlIapBtJUhlbl90TSrE9atvNziPTnNvT51cKEY\n" +
          "WQPJIrSPnNVeKtelttQKbfi3QBFGmh95DmK/D5fs4C8fF5Q=\n" +
          "-----END CERTIFICATE-----\n"
    ],
  },
};

module.exports = certs[process.env.SL_ENV || 'prod'] || certs.prod;
