export default {
  languageName: "Українська",
  ui: {
    save: "Зберегти",
    delete: "Видалити",
    goHome: "На головну",
  },
  validation: {
    fieldIsRequired: "Обов'язкове поле",
  },
  notification: {
    walletAdded: "Гаманець додано",
    walletUpdated: "Гаманець оновлено",
    walletDeleted: "Гаманець видалено",
    textCopied: "Посилання скопійовано",
    textCopyFailed: "Сталась помилка при копіюванні тексту",
    walletJoined: "Успішно приєднано до гаманця",
    userRemoved: "Доступ до гаманця для користувача забрано",
  },
  errors: {
    NoTokenProvided: "Помилка авторизації. Будь ласка, спробуйте ще раз",
    AuthorizationFailed: "Не вдалось авторизуватись",
    NoWalletData: "Не вдалось створити гаманець",
    WalletFetchError: "Не вдалось отримати список гаманців",
    WalletExists: "Гаманець з такою назвою вже існує",
    WalletCreationError: "Не вдалось зберегти гаманець",
    WalletNotFound: "Гаманець не знайдено",
    WalletDeletionError: "Не вдалось видалити гаманець",
    InvitationNotFound: "Посилання на приєднання не дійсне",
    InvitationExpired: "Час дії посилання минув",
    InvitationRunOut: "Кількість приєднань по цьому посиланню вичерпано",
  },
  home: {
    title: "Інформація про гаманці",
  },
  statistic: {
    title: "Статистика",
  },
  profile: {
    title: "Профіль",
    logout: "Вийти",
  },
  wallet: {
    add: "Додати гаманець",
    newWallet: "Новий гаманець",
    editWallet: "Налаштувати гаманець",
    shareWallet: "Поділитись гаманцем",
    joinWallet: "Приєднатись до гаманця",
    walletName: "Назва гаманця",
    share: "Поділитись",
    edit: "Налаштувати",
    detail: "Детальна статистика",
    addExpense: "Нова витрата",
    addIncome: "Нове надходження",
    sharedForUsersTitle: "Користувачі з доступом до гаманця",
    generateLink: "Згенерувати посилання",
    myWallets: "Мої гаманці",
    sharedWallets: "Спільні гаманці",
    noUserAdded:
      "Жодного користувача не додано до гаманця. Згенеруйте посилання, щоб поділитись гаманцем",
  },
  login: {
    title: "Авторизація",
  },
  bottomNavigation: {
    home: "Гаманці",
    statistic: "Статистика",
    profile: "Профіль",
  },
  $vuetify: {
    badge: "Значок",
    open: "Відкрити",
    close: "Закрити",
    dismiss: "Відхилити",
    confirmEdit: {
      ok: "OK",
      cancel: "Відмінити",
    },
    dataIterator: {
      noResultsText: "В результаті пошуку нічого не знайдено",
      loadingText: "Завантаження...",
    },
    dataTable: {
      itemsPerPageText: "Рядків на сторінці:",
      ariaLabel: {
        sortDescending: "Відсортовано за спаданням.",
        sortAscending: "Відсортовано за зростанням.",
        sortNone: "Не відсортовано.",
        activateNone: "Активувати, щоб видалити сортування.",
        activateDescending: "Активувати, щоб відсортувати за спаданням.",
        activateAscending: "Активувати, щоб відсортувати за зростанням.",
      },
      sortBy: "Відсортувати за",
    },
    dataFooter: {
      itemsPerPageText: "Елементів на сторінці:",
      itemsPerPageAll: "Всі",
      nextPage: "Наступна сторінка",
      prevPage: "Попередня сторінка",
      firstPage: "Перша сторінка",
      lastPage: "Остання сторінка",
      pageText: "{0}-{1} з {2}",
    },
    dateRangeInput: {
      divider: "по",
    },
    datePicker: {
      itemsSelected: "{0} обрано",
      range: {
        title: "Оберіть дати",
        header: "Введіть дати",
      },
      title: "Оберіть дати",
      header: "Введіть дати",
      input: {
        placeholder: "Введіть дати",
      },
    },
    noDataText: "Немає даних для відображення",
    carousel: {
      prev: "Попередній слайд",
      next: "Наступий слайд",
      ariaLabel: {
        delimiter: "Слайд {0} з {1}",
      },
    },
    calendar: {
      moreEvents: "Ще {0}",
      today: "Сьогодні",
    },
    input: {
      clear: "Очистити {0}",
      prependAction: "{0} початкова дія",
      appendAction: "{0} додаткова дія",
      otp: "Будь ласка, введіть OTP символ {0}",
    },
    fileInput: {
      counter: "{0} файлів",
      counterSize: "{0} файлів ({1} загалом)",
    },
    timePicker: {
      am: "ДП",
      pm: "ПП",
      title: "Виберіть час",
    },
    pagination: {
      ariaLabel: {
        root: "Навігація по сторінках",
        next: "Наступна сторінка",
        previous: "Попередня сторінка",
        page: "Перейти на сторінку {0}",
        currentPage: "Поточна сторінка, Сторінка {0}",
        first: "Перша сторінка",
        last: "Остання сторінка",
      },
    },
    stepper: {
      next: "Наступна",
      prev: "Попередня",
    },
    rating: {
      ariaLabel: {
        item: "Оцінка {0} 3 {1}",
      },
    },
    loading: "Завантаження...",
    infiniteScroll: {
      loadMore: "Завантажити ще",
      empty: "Більше немає",
    },
  },
};
