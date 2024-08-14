export default {
  languageName: "English",
  ui: {
    save: "Save",
    delete: "Delete",
    goHome: "To homepage",
  },
  validation: {
    fieldIsRequired: "Required field",
  },
  notification: {
    walletAdded: "Wallet added",
    walletUpdated: "Wallet updated",
    walletDeleted: "Wallet deleted",
    textCopied: "Link copied",
    textCopyFailed: "Error during the copying",
    walletJoined: "Successfully joined the wallet",
  },
  errors: {
    NoTokenProvided: "Authorization failed. Please try again",
    AuthorizationFailed: "Unable to authorize",
    NoWalletData: "Failed to create the wallet",
    WalletFetchError: "Failed to receive wallets list",
    WalletExists: "You already have a wallet with this name",
    WalletCreationError: "Failed to create the wallet",
    WalletNotFound: "Wallet not found",
    WalletDeletionError: "Failed to delete the wallet",
    InvitationNotFound: "Invitation link is not valid",
    InvitationExpired: "Invitation link expired",
    InvitationRunOut: "Invitation link run out of activations",
  },
  home: {
    title: "Home page",
  },
  statistic: {
    title: "Statistic page",
  },
  profile: {
    title: "Profile",
    logout: "Logout",
  },
  wallet: {
    add: "Add wallet",
    newWallet: "New wallet",
    editWallet: "Configure wallet",
    shareWallet: "Share wallet",
    joinWallet: "Join wallet",
    walletName: "Wallet name",
    share: "Share",
    edit: "Configure",
    detail: "Detailed statistic",
    addExpense: "New expense",
    addIncome: "New income",
    sharedForUsersTitle: "Users with access to the wallet",
    generateLink: "Generate invite link",
    myWallets: "My wallets",
    sharedWallets: "Shared wallets",
  },
  login: {
    title: "Authorization",
  },
  bottomNavigation: {
    home: "Wallets",
    statistic: "Statistic",
    profile: "Profile",
  },
  $vuetify: {
    badge: "Badge",
    open: "Open",
    close: "Close",
    dismiss: "Dismiss",
    confirmEdit: {
      ok: "OK",
      cancel: "Cancel",
    },
    dataIterator: {
      noResultsText: "No matching records found",
      loadingText: "Loading items...",
    },
    dataTable: {
      itemsPerPageText: "Rows per page:",
      ariaLabel: {
        sortDescending: "Sorted descending.",
        sortAscending: "Sorted ascending.",
        sortNone: "Not sorted.",
        activateNone: "Activate to remove sorting.",
        activateDescending: "Activate to sort descending.",
        activateAscending: "Activate to sort ascending.",
      },
      sortBy: "Sort by",
    },
    dataFooter: {
      itemsPerPageText: "Items per page:",
      itemsPerPageAll: "All",
      nextPage: "Next page",
      prevPage: "Previous page",
      firstPage: "First page",
      lastPage: "Last page",
      pageText: "{0}-{1} of {2}",
    },
    dateRangeInput: {
      divider: "to",
    },
    datePicker: {
      itemsSelected: "{0} selected",
      range: {
        title: "Select dates",
        header: "Enter dates",
      },
      title: "Select date",
      header: "Enter date",
      input: {
        placeholder: "Enter date",
      },
    },
    noDataText: "No data available",
    carousel: {
      prev: "Previous visual",
      next: "Next visual",
      ariaLabel: {
        delimiter: "Carousel slide {0} of {1}",
      },
    },
    calendar: {
      moreEvents: "{0} more",
      today: "Today",
    },
    input: {
      clear: "Clear {0}",
      prependAction: "{0} prepended action",
      appendAction: "{0} appended action",
      otp: "Please enter OTP character {0}",
    },
    fileInput: {
      counter: "{0} files",
      counterSize: "{0} files ({1} in total)",
    },
    timePicker: {
      am: "AM",
      pm: "PM",
      title: "Select Time",
    },
    pagination: {
      ariaLabel: {
        root: "Pagination Navigation",
        next: "Next page",
        previous: "Previous page",
        page: "Go to page {0}",
        currentPage: "Page {0}, Current page",
        first: "First page",
        last: "Last page",
      },
    },
    stepper: {
      next: "Next",
      prev: "Previous",
    },
    rating: {
      ariaLabel: {
        item: "Rating {0} of {1}",
      },
    },
    loading: "Loading...",
    infiniteScroll: {
      loadMore: "Load more",
      empty: "No more",
    },
  },
};
