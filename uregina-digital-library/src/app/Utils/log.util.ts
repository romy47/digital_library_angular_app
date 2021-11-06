import { AuthToken } from "../Models";

declare const window: any;

export abstract class LogLocations {
    // Signin
    public static signin = 'Signin';

    // Dashboard
    public static DashboardInput = 'Dashboard: Input';
    public static DashboardTaskCard = 'Dashboard: Task-Card';

    // Task Detail
    public static TaskDetailInput = 'Task Detail: Input';
    public static TaskDetailSessionCard = 'Task Detail: Session Card';
    public static TaskDetailWorkspaceButton = 'Task Detail: Workspace';
    public static TaskDetailBackButton = 'Task Detail: Back Button';

    // SERP
    public static SERPInput = 'SERP: Input';
    public static SERPPagination = 'SERP: Pagination';
    public static SERPBackButtonDashboard = 'SERP: Back Button Dashboard';
    public static SERPBackButtonTaskDetail = 'SERP: Back Button Task Detail';
    public static SERPDocumnentCard = 'SERP: Documnent Card';
    public static SERPDocumnentView = 'SERP: Documnent View';
    public static SERPFacetBox = 'SERP: Facet Box';

    // Workspace
    public static WorkspaceBackButtonDashboard = 'Workspace: Back Button Dashboard';
    public static WorkspaceBackButtonTaskDetail = 'Workspace: Back Button Task Detail';
    public static WorkspaceDocumentCard = 'Workspace: Document Card';
    public static WorkspaceDocumentView = 'Workspace: Document View';
    public static WorkspaceFacetBox = 'Workspace: Facet Box';
}

export abstract class LogActivities {
    // Signin
    public static clickedOnOrcidButton = 'Clicked on orcid button';
    public static loginSuccessful = 'Login Successful';
    public static loginFailed = 'Login Failed';

    // public static newUserCreated = 'New user created';
    // public static existingUserVerified = 'Existing user verified';

    // Dashboard
    public static createdATask = 'Created a task';
    public static openedATask = 'Opened a task';
    public static renamedATask = 'Renamed a task';
    public static deletedATask = 'Deleted a task';
    public static clickedOnQueryCount = 'Clicked on query count';
    public static cLickedOnDocumentCount = 'CLicked on document count';
    public static clickedOnSessionCount = 'Clicked on session count';

    // Session Card
    public static issuesANewQuery = 'Issues a new query';
    public static clicksOnASessionCard = 'Clicks on a session card';
    public static ClicksOnQueryCount = 'Clicks on query count';
    public static ClicksOnDocumentCount = 'Clicks on document count';
    public static ClicksOnSessionTimestamp = 'Clicks on session timestamp';
    public static reissueANewQuery = 'Reissue a new query';
    public static ClicksOnWorkspaceButton = 'Clicks on workspace button';
    public static ClicksOnBackToDashboardButton = 'Clicks on back to dashboard button';

    // SERP
    public static IssueANewQuery = 'Issue a new query';
    public static ClicksOnNextPageButton = 'Clicks on next page button';
    public static ClicksOnPreviousPageButton = 'Clicks on previous page button';
    public static ClicksOnNthPageButton = 'Clicks on nth page button';
    public static ClicksOnBackToTaskDetailButton = 'Clicks on back to task-detail button';
    public static SaveADocument = 'Save a document';
    public static RemoveADocumentFromSavedDocumentList = 'Remove a document from saved document list';
    public static FocusesOverADocument = 'Focuses over a document';
    public static OpenDocumentDetailView = 'Open document detail view';
    public static CloseDocumentDetailView = 'Close document detail view';
    public static ClicksOnGetDocumentButton = 'Clicks on get document button';
    public static ClicksOnAFacet = 'Clicks on a facet';
    public static UnselectsAFacet = 'Unselects on a facet';
    public static LongPressesOnAFacet = 'Long Presses on a facet';
    public static MinimizesFacetBox = 'Minimizes facet box';
    public static MaximizesFacetBox = 'Maximizes facet box';
    public static ChangesFacetCategory = 'Changes facet category';

    // Workspace
    public static ClicksOnTheBackToTaskDetailPage = 'Clicks on the back to task detail page';
    public static ClicksOnTheBackToDashboardPage = 'Clicks on the back to dashboard page';
    // public static RemoveADocumentFromSavedDocumentList = 'Remove a document from saved document list';
    // public static FocusesOverADocument = 'Focuses over a document';
    // public static OpenDocumentDetailView = 'Open document detail view';
    // public static CloseDocumentDetailView = 'Close document detail view';
    // public static ClicksOnGetDocumentButton = 'Clicks on get document button';
    // public static ClicksOnAFacet = 'Clicks on a facet';
    // public static UnselectsAFacet = 'Unselects a facet';
    // public static LongPressesOnAFacet = 'Long presses on a facet';
    // public static MinimizesFacetBox = 'Minimizes facet box';
    // public static MaximizesFacetBox = 'Maximizes facet box';
    // public static ChangesFacetCategory = 'Changes facet category';
}

export function customLog(message: string, objectName = '', id = '') {
    if (window.LogUI && window.LogUI.isActive()) {
        window.LogUI.logCustomMessage({
            name: message,
            objectName: objectName,
            id: id
        });
    }
}

export function updateLogUIAppData(auth: AuthToken) {
    if (window.LogUI && window.LogUI.isActive()) {
        window.LogUI.updateApplicationSpecificData({
            userName: auth && auth.name ? auth.name : 'Not Logged in',
            userOrcID: auth && auth.orcid ? auth.orcid : '',
            userID: auth && auth._id ? auth._id : '',
            interface: 'UR_BASELINE'
        });
    }
}